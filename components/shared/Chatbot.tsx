'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MessageSquare, RefreshCw, Send, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for each message
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call (replace with your actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const botMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `I'm your RevoEstate assistant. You asked: "${input}". In a real implementation, this would connect to your backend API.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new conversation
  const startNewChat = () => {
    setMessages([]);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mx-3 fixed bottom-6 md:right-6 z-50">
      {isOpen ? (
        <Card className="w-full sm:w-[430px] md:h-[500px] shadow-xl border-0 bg-background overflow-y-scroll">
          <CardHeader className="bg-sky-700 p-4 mt-[-25px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-primary-foreground">RevoEstate Assistant</CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-100 hover:text-sky-700 hover:bg-white/70 rounded-full cursor-pointer font-bold h-8 w-8"
                  onClick={startNewChat}
                  disabled={isLoading}
                >
                  <RefreshCw strokeWidth={3} className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                   className="text-gray-100 hover:text-sky-700 hover:bg-white/70 rounded-full cursor-pointer font-bold h-8 w-8"
                  onClick={toggleChat}
                >
                  <X strokeWidth={3} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] w-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[350px] text-center text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium">How can I help you today?</h3>
                  <p className="text-sm mt-2">
                    Ask me about properties, market trends, or anything related to revoestate.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 text-sm',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src="/logo.png" alt="RevoEstate" />
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg p-3',
                          message.role === 'user'
                            ? 'bg-sky-700 text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="my-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                            code: ({ node, inline, className, children, ...props }: any) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline ? (
                                <code
                                  className={cn(
                                    'block bg-gray-00 dark:bg-gray-700 rounded p-2 my-2 font-mono text-sm',
                                    className
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <code
                                  className={cn(
                                    'bg-gray-200 dark:bg-gray-700 rounded px-1',
                                    className
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        <p className="text-xs mt-1 opacity-70">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-sky-700 text-primary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/logo.png" alt="RevoEstate" />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-75" />
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button variant='ghost' className='text-sky-700 bg-sky-50 rounded-full hover:bg-sky-100 hover:text-sky-800 cursor-pointer' type="submit" size="icon" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send size={38} strokeWidth={2} className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg bg-sky-700 cursor-pointer hover:bg-sky-700/80 hover:text-white"
        >
          <MessageSquare strokeWidth={3} className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}