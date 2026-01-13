import { useState } from 'react';
import { 
  Inbox, 
  Mail, 
  MailOpen,
  Shield,
  Building2,
  Newspaper,
  Users,
  Lock,
  AlertTriangle,
  Check,
  Trash2,
  Reply
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

type SenderType = 'ngo' | 'journalist' | 'moderator';

interface InboxMessage {
  id: string;
  senderType: SenderType;
  senderLabel: string;
  subject: string;
  preview: string;
  content: string;
  relatedIncidentId?: string;
  timestamp: Date;
  read: boolean;
}

const senderConfig: Record<SenderType, { icon: React.ElementType; color: string; bgColor: string }> = {
  ngo: {
    icon: Building2,
    color: 'text-credible',
    bgColor: 'bg-credible/10',
  },
  journalist: {
    icon: Newspaper,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  moderator: {
    icon: Users,
    color: 'text-severity-medium',
    bgColor: 'bg-severity-medium/10',
  },
};

const mockMessages: InboxMessage[] = [
  {
    id: '1',
    senderType: 'ngo',
    senderLabel: 'Verified NGO',
    subject: 'Thank you for your report',
    preview: 'Your corruption report has been reviewed and we are taking action...',
    content: 'Your corruption report regarding the municipal contract has been reviewed by our team. We are coordinating with relevant authorities to investigate this matter further. No response is required from you, but we wanted to acknowledge your contribution to civic transparency.',
    relatedIncidentId: '123',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    senderType: 'journalist',
    senderLabel: 'Verified Journalist',
    subject: 'Request for additional details',
    preview: 'We are investigating the infrastructure issue you reported...',
    content: 'We are a team of investigative journalists working on a story about infrastructure failures in your area. Your report aligns with patterns we have observed. If you are comfortable sharing additional details or evidence, please enable replies on this message. Your anonymity will be fully protected.',
    relatedIncidentId: '456',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '3',
    senderType: 'moderator',
    senderLabel: 'Platform Moderator',
    subject: 'Report status update',
    preview: 'Your report has been escalated for review...',
    content: 'We wanted to inform you that your recent report has been escalated to "Under Review" status. This means it has received significant community attention and is being assessed for potential action. Thank you for your contribution.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
  },
];

interface AnonymousInboxProps {
  className?: string;
}

export function AnonymousInbox({ className }: AnonymousInboxProps) {
  const [messages, setMessages] = useState<InboxMessage[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyEnabled, setReplyEnabled] = useState<Record<string, boolean>>({});

  const unreadCount = messages.filter(m => !m.read).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const toggleReply = (messageId: string) => {
    setReplyEnabled(prev => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  return (
    <div className={className}>
      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Anonymous Inbox</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Lock className="h-3 w-3" />
            One-way secure messaging from verified organizations
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex h-[400px]">
            {/* Message list */}
            <ScrollArea className="w-1/2 border-r border-border/50">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {messages.map((message) => {
                    const config = senderConfig[message.senderType];
                    const Icon = config.icon;
                    
                    return (
                      <button
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message);
                          markAsRead(message.id);
                        }}
                        className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                        } ${!message.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-3 w-3 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {!message.read && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                              <p className="text-xs text-muted-foreground truncate">
                                {message.senderLabel}
                              </p>
                            </div>
                            <p className={`text-sm truncate ${!message.read ? 'font-medium' : ''}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {message.preview}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Message detail */}
            <div className="w-1/2">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {(() => {
                            const config = senderConfig[selectedMessage.senderType];
                            const Icon = config.icon;
                            return (
                              <>
                                <div className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                  <Icon className={`h-3 w-3 ${config.color}`} />
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {selectedMessage.senderLabel}
                                </Badge>
                              </>
                            );
                          })()}
                        </div>
                        <h4 className="font-medium">{selectedMessage.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(selectedMessage.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {selectedMessage.content}
                    </p>

                    {selectedMessage.relatedIncidentId && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-xs text-muted-foreground">Related to incident:</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                          View incident #{selectedMessage.relatedIncidentId}
                        </Button>
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />
                  
                  <div className="p-4 bg-muted/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-severity-medium flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`reply-${selectedMessage.id}`} className="text-sm font-medium">
                            Enable replies
                          </Label>
                          <Switch
                            id={`reply-${selectedMessage.id}`}
                            checked={replyEnabled[selectedMessage.id] || false}
                            onCheckedChange={() => toggleReply(selectedMessage.id)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {replyEnabled[selectedMessage.id] 
                            ? 'Replies enabled. The sender can receive your response while your identity remains protected.'
                            : 'By default, replies are disabled to protect your anonymity. Only enable if you wish to communicate.'
                          }
                        </p>
                        {replyEnabled[selectedMessage.id] && (
                          <Button size="sm" className="mt-2 gap-1" variant="outline">
                            <Reply className="h-3 w-3" />
                            Compose Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MailOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy notice */}
          <div className="p-3 border-t border-border/50 bg-muted/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>
                All messages are encrypted. Senders cannot identify you. Replies are optional and anonymous.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
