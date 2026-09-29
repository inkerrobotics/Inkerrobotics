'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './chatbot.css';
import {
  ChatMessage,
  ChatAction,
  getInitialBotMessage,
  processUserQuery,
  LeadSubmission,
} from '@/lib/chatbot/chatEngine';

/**
 * Light Markdown Parser for Bold text, Links, Bullet lists and linebreaks.
 */
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    if (!line.trim()) {
      return <div key={idx} className="inker-msg-spacer" />;
    }

    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
    const content = isBullet ? line.trim().replace(/^[•-]\s*/, '') : line;

    const parts = [];
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('[') && token.endsWith(')')) {
        const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const isInternal = href.startsWith('/');
          parts.push(
            isInternal ? (
              <Link key={match.index} href={href} className="inker-msg-link">
                {label}
              </Link>
            ) : (
              <a
                key={match.index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inker-msg-link"
              >
                {label}
              </a>
            )
          );
        }
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="inker-msg-bold">
            {token.slice(2, -2)}
          </strong>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={idx} className="inker-msg-bullet-row">
          <span className="inker-msg-bullet-dot">•</span>
          <span className="inker-msg-bullet-text">{parts}</span>
        </div>
      );
    }

    return (
      <p key={idx} className="inker-msg-para">
        {parts}
      </p>
    );
  });
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // In-chat lead capture states
  const [leadForm, setLeadForm] = useState<LeadSubmission>({
    name: '',
    contact: '',
    interest: 'Robotics Solutions',
    message: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [submittedLeadMsgId, setSubmittedLeadMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([getInitialBotMessage()]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = Math.min(650, 250 + text.length * 8);
    setTimeout(() => {
      const response = processUserQuery(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.replyText,
        timestamp: Date.now(),
        actions: response.actions,
        isLeadForm: response.isLeadForm,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.query) {
      handleSendMessage(action.query);
    } else if (action.isLeadForm) {
      const promptLeadMsg: ChatMessage = {
        id: `lead-prompt-${Date.now()}`,
        sender: 'bot',
        text: `Please provide your details below and our team will get in touch with you within 24 hours:`,
        timestamp: Date.now(),
        isLeadForm: true,
      };
      setMessages((prev) => [...prev, promptLeadMsg]);
    }
  };

  const handleResetChat = () => {
    setMessages([getInitialBotMessage()]);
  };

  const handleLeadSubmit = async (msgId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.contact) return;

    setIsSubmittingLead(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.contact.includes('@') ? leadForm.contact : '',
          phone: !leadForm.contact.includes('@') ? leadForm.contact : '',
          organization: 'Chatbot Lead',
          inquiryType: leadForm.interest,
          message: leadForm.message || 'Submitted via Inker AI Chatbot',
        }),
      }).catch(() => {});

      setSubmittedLeadMsgId(msgId);
      setLeadForm({ name: '', contact: '', interest: 'Robotics Solutions', message: '' });

      setTimeout(() => {
        const confirmMsg: ChatMessage = {
          id: `lead-success-${Date.now()}`,
          sender: 'bot',
          text: `✅ **Thank you, ${leadForm.name}!**\n\nYour request regarding **${leadForm.interest}** has been received. Our team will contact you within **24 hours**.\n\nFeel free to explore our solutions below:`,
          timestamp: Date.now(),
          actions: [
            { label: 'Explore Robotics', query: 'Tell me about Inker Alton' },
            { label: 'AI Solutions', query: 'Tell me about AI solutions' },
            { label: 'EduTech Programs', query: 'Tell me about EduTech programs' },
          ],
        };
        setMessages((prev) => [...prev, confirmMsg]);
      }, 400);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="inker-chat-root">
      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div className="inker-chat-window" role="dialog" aria-label="Inker AI Chatbot">
          {/* Header */}
          <div className="inker-chat-header">
            <div className="inker-chat-header-info">
              <div className="inker-chat-header-avatar">
                <Image
                  src="/title logo.webp"
                  alt="Inker Assistant"
                  width={26}
                  height={26}
                  priority
                />
              </div>
              <div className="inker-chat-header-titles">
                <div className="inker-chat-title">Inker Assistant</div>
                <div className="inker-chat-subtitle">
                  <span className="inker-chat-subtitle-dot" />
                  Online • Robotics &amp; AI
                </div>
              </div>
            </div>

            <div className="inker-chat-controls">
              {/* Reset Chat */}
              <button
                type="button"
                className="inker-chat-ctrl-btn"
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="inker-chat-ctrl-btn"
                onClick={toggleChat}
                title="Close chat"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body / Messages */}
          <div className="inker-chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`inker-chat-msg ${msg.sender}`}>
                <div className="inker-chat-bubble">
                  {renderFormattedMessage(msg.text)}

                  {/* Inline Lead Capture Form */}
                  {msg.isLeadForm && (
                    <div className="inker-chat-lead-card">
                      {submittedLeadMsgId === msg.id ? (
                        <div className="inker-chat-lead-success">
                          ✓ Details received! We will reach out within 24 hours.
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleLeadSubmit(msg.id, e)}>
                          <div className="inker-chat-lead-header">
                            Request Callback / Demo
                          </div>
                          <div className="inker-chat-lead-fields">
                            <input
                              className="inker-chat-lead-input"
                              placeholder="Your Name *"
                              value={leadForm.name}
                              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                              required
                            />
                            <input
                              className="inker-chat-lead-input"
                              placeholder="Phone or Email *"
                              value={leadForm.contact}
                              onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })}
                              required
                            />
                            <select
                              className="inker-chat-lead-select"
                              value={leadForm.interest}
                              onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value })}
                            >
                              <option value="Robotics Solutions">Robotics &amp; Automation</option>
                              <option value="Inker Alton / Humanoids">Inker Alton / Humanoids</option>
                              <option value="Robot Rental (RaaS)">Robot Rental (RaaS)</option>
                              <option value="AI Solutions / Lucky Draw">AI Solutions / Spin Wheel</option>
                              <option value="EduTech / Campus Labs">EduTech / Arduino Innovation Labs</option>
                              <option value="RoboParks Partnership">RoboParks Partnership</option>
                              <option value="Careers / Internship">Careers / Internship</option>
                              <option value="Other">Other Inquiry</option>
                            </select>
                            <input
                              className="inker-chat-lead-input"
                              placeholder="Project notes (optional)"
                              value={leadForm.message}
                              onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                            />
                            <button
                              type="submit"
                              className="inker-chat-lead-submit"
                              disabled={isSubmittingLead}
                            >
                              {isSubmittingLead ? 'Submitting…' : 'Submit Request'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions / Suggestion Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="inker-chat-actions">
                    {msg.actions.map((act, aIdx) => {
                      if (act.url) {
                        return (
                          <Link
                            key={aIdx}
                            href={act.url}
                            className="inker-chat-action-btn inker-chat-action-link"
                          >
                            <span>{act.label}</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </Link>
                        );
                      }
                      return (
                        <button
                          key={aIdx}
                          type="button"
                          className="inker-chat-action-btn"
                          onClick={() => handleActionClick(act)}
                        >
                          {act.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="inker-chat-msg bot">
                <div className="inker-chat-typing">
                  <span className="inker-chat-typing-dot" />
                  <span className="inker-chat-typing-dot" />
                  <span className="inker-chat-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="inker-chat-footer">
            <form
              className="inker-chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                ref={inputRef}
                className="inker-chat-input"
                type="text"
                placeholder="Ask about robots, AI, labs, founders..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={400}
              />
              <button
                type="submit"
                className="inker-chat-send-btn"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FLOATING TRIGGER LAUNCHER (Only visible when chat is closed) ── */}
      {!isOpen && (
        <button
          type="button"
          className="inker-chat-btn"
          onClick={toggleChat}
          aria-label="Open chat"
          title="Ask Inker Assistant"
        >
          <span className="inker-chat-pulse" />
          <div className="inker-chat-btn-inner">
            <Image
              src="/title logo.webp"
              alt="Inker Assistant"
              width={30}
              height={30}
              className="inker-chat-avatar-icon"
              priority
            />
            <span className="inker-chat-status-dot" />
          </div>
        </button>
      )}
    </div>
  );
}
