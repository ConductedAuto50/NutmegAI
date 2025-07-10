'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';

import equal from 'fast-deep-equal';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 as LoaderIcon, X as XIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const clsx = (...args: any[]) => args.filter(Boolean).join(' ');

// Type Definitions
interface Attachment {
  url: string;
  name: string;
  contentType: string;
  size: number;
}

interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
}

type VisibilityType = 'public' | 'private' | 'unlisted' | string;

// Utility Functions
const cn = (...inputs: any[]) => {
  return twMerge(clsx(inputs));
};

// Button variants using cva
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary: black background, white text
        default: 'bg-black text-white hover:bg-gray-800',
        // Destructive: high-contrast gray outline, black text
        destructive:
          'border border-black text-black hover:bg-gray-100',
        // Outline: grayscale border, white background, black text
        outline:
          'border border-gray-400 bg-white hover:bg-gray-100 hover:text-black',
        // Secondary: grayscale background, gray text
        secondary:
          'bg-gray-200 text-black hover:bg-gray-300',
        // Ghost: hover effect, default text color (should be black)
        ghost: 'text-black hover:bg-gray-100 hover:text-black', // Explicitly set text to black
        // Link: black text
        link: 'text-black underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Button component
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'button' : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

// Textarea component
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-base ring-offset-transparent placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

// Stop Icon SVG (uses currentColor)
const StopIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg height={size} viewBox="0 0 16 16" width={size} style={{ color: 'currentcolor' }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
      />
    </svg>
  );
};

// Paperclip Icon SVG (uses currentColor)
const PaperclipIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
      className="-rotate-45"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8591 1.70735C10.3257 1.70735 9.81417 1.91925 9.437 2.29643L3.19455 8.53886C2.56246 9.17095 2.20735 10.0282 2.20735 10.9222C2.20735 11.8161 2.56246 12.6734 3.19455 13.3055C3.82665 13.9376 4.68395 14.2927 5.57786 14.2927C6.47178 14.2927 7.32908 13.9376 7.96117 13.3055L14.2036 7.06304L14.7038 6.56287L15.7041 7.56321L15.204 8.06337L8.96151 14.3058C8.06411 15.2032 6.84698 15.7074 5.57786 15.7074C4.30875 15.7074 3.09162 15.2032 2.19422 14.3058C1.29682 13.4084 0.792664 12.1913 0.792664 10.9222C0.792664 9.65305 1.29682 8.43592 2.19422 7.53852L8.43666 1.29609C9.07914 0.653606 9.95054 0.292664 10.8591 0.292664C11.7678 0.292664 12.6392 0.653606 13.2816 1.29609C13.9241 1.93857 14.2851 2.80997 14.2851 3.71857C14.2851 4.62718 13.9241 5.49858 13.2816 6.14106L13.2814 6.14133L7.0324 12.3835C7.03231 12.3836 7.03222 12.3837 7.03213 12.3838C6.64459 12.7712 6.11905 12.9888 5.57107 12.9888C5.02297 12.9888 4.49731 12.7711 4.10974 12.3835C3.72217 11.9959 3.50444 11.4703 3.50444 10.9222C3.50444 10.3741 3.72217 9.8484 4.10974 9.46084L4.11004 9.46054L9.877 3.70039L10.3775 3.20051L11.3772 4.20144L10.8767 4.70131L5.11008 10.4612C5.11005 10.4612 5.11003 10.4612 5.11 10.4613C4.98779 10.5835 4.91913 10.7493 4.91913 10.9222C4.91913 11.0951 4.98782 11.2609 5.11008 11.3832C5.23234 11.5054 5.39817 11.5741 5.57107 11.5741C5.74398 11.5741 5.9098 11.5054 6.03206 11.3832L6.03233 11.3829L12.2813 5.14072C12.2814 5.14063 12.2815 5.14054 12.2816 5.14045C12.6586 4.7633 12.8704 4.25185 12.8704 3.71857C12.8704 3.18516 12.6585 2.6736 12.2813 2.29643C11.9041 1.91925 11.3926 1.70735 10.8591 1.70735Z"
        fill="currentColor"
      />
    </svg>
  );
};

// Arrow Up Icon SVG (Send) (uses currentColor)
const ArrowUpIcon = ({ size = 16 }: { size?: number }) => {
    return (
      <svg
        height={size}
        strokeLinejoin="round"
        viewBox="0 0 16 16"
        width={size}
        style={{ color: 'currentcolor' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
          fill="currentColor"
        />
      </svg>
    );
  };

// Sub-Components

interface SuggestedActionsProps {
  chatId: string;
  onSelectAction: (action: string) => void;
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  onSelectAction,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Show me stats for',
      label: 'Manchester United this season',
      action: 'Show me stats for Manchester United this season',
    },
    {
      title: 'Who scored the most',
      label: 'goals in Premier League?',
      action: 'Who scored the most goals in Premier League this season?',
    },
    {
      title: 'Compare the performance',
      label: 'of Liverpool vs Arsenal',
      action: 'Compare the performance of Liverpool vs Arsenal this season',
    },
    {
      title: 'What are the latest',
      label: 'transfer rumors?',
      action: 'What are the latest transfer rumors and news?',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid pb-2 sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            delay: 0.05 * index,
            duration: 0.25,
            ease: "easeInOut"
          }}
          key={`suggested-action-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={() => onSelectAction(suggestedAction.action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start
                       border-transparent bg-transparent hover:bg-[#0a2528] text-white hover:text-gray-100 hover:border-[#20B8CD]"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-gray-400">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;
    return true;
  },
);


const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-1">
      <div className="w-20 h-16 aspect-video bg-gray-200 rounded-md relative flex flex-col items-center justify-center overflow-hidden border border-gray-300">
        {contentType?.startsWith('image/') && url ? (
          <img
            key={url}
            src={url}
            alt={name ?? 'An image attachment'}
            className="rounded-md size-full object-cover grayscale"
          />
        ) : (
          <div className="flex items-center justify-center text-xs text-gray-600 text-center p-1">
             File: {name?.split('.').pop()?.toUpperCase() || 'Unknown'}
          </div>
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-gray-500"
          >
            <LoaderIcon className="size-5" />
          </div>
        )}
      </div>
      <div className="text-xs text-gray-600 max-w-20 truncate">
        {name}
      </div>
    </div>
  );
};

function PureAttachmentsButton({
  fileInputRef,
  disabled,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  disabled: boolean;
}) {
  return (
    <Button
      data-testid="attachments-button"
      className="rounded-md rounded-bl-lg p-[7px] h-fit border border-gray-300 hover:bg-gray-200"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={disabled}
      variant="ghost" // ghost variant now has text-black
      aria-label="Attach files"
    >
      <PaperclipIcon size={14} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton, (prev, next) => prev.disabled === next.disabled);

function PureStopButton({ onStop }: { onStop: () => void }) {
  return (
    <Button
      data-testid="stop-button"
      // Using default variant (bg-black) and setting text color to white for the icon
      className="rounded-full p-1.5 h-fit border border-black text-white" // Added text-white
      onClick={(event) => {
        event.preventDefault();
        onStop();
      }}
      aria-label="Stop generating"
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton, (prev, next) => prev.onStop === next.onStop);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
  attachments,
  canSend,
  isGenerating,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
  attachments: Array<Attachment>;
  canSend: boolean;
  isGenerating: boolean;
}) {
  const isDisabled =
    uploadQueue.length > 0 ||
    !canSend ||
    isGenerating ||
    (input.trim().length === 0 && attachments.length === 0);

  return (
    <Button
      data-testid="send-button"
      // Uses default variant (bg-black text-white)
      className="rounded-full p-1.5 h-fit"
      onClick={(event) => {
        event.preventDefault();
        if (!isDisabled) {
          submitForm();
        }
      }}
      disabled={isDisabled}
      aria-label="Send message"
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length) return false;
  if (prevProps.attachments.length !== nextProps.attachments.length) return false;
  if (prevProps.attachments.length > 0 && !equal(prevProps.attachments, nextProps.attachments)) return false;
  if (prevProps.canSend !== nextProps.canSend) return false;
  if (prevProps.isGenerating !== nextProps.isGenerating) return false;
  return true;
});


// Main Component

interface MultimodalInputProps {
  chatId: string;
  messages: Array<UIMessage>;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  onSendMessage: (params: { input: string; attachments: Attachment[] }) => void;
  onStopGenerating: () => void;
  isGenerating: boolean;
  canSend: boolean;
  className?: string;
  selectedVisibilityType: VisibilityType;
}

function PureMultimodalInput({
  chatId,
  messages,
  attachments,
  setAttachments,
  onSendMessage,
  onStopGenerating,
  isGenerating,
  canSend,
  className,
  selectedVisibilityType,
}: MultimodalInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = (focus: boolean) => {
    if (isGenerating && focus) return;
    setIsFocused(focus);
  };

  const hasContent = input.length > 0 || attachments.length > 0;
  
  const showSuggestedActions =
    messages.length === 0 && !hasContent && isFocused;

  const handleSelectAction = useCallback((action: string) => {
    setInput(action);
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, attachments]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const uploadFile = async (file: File): Promise<Attachment | undefined> => {
    try {
      // Simulate file upload
      setUploadQueue(prev => [...prev, file.name]);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        contentType: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      return undefined;
    } finally {
      setUploadQueue(prev => prev.filter(name => name !== file.name));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments = await Promise.all(
      Array.from(files).map(file => uploadFile(file)),
    );

    setAttachments(prev => [...prev, ...newAttachments.filter(Boolean) as Attachment[]]);
  };
  
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          uploadFile(file).then(attachment => {
            if (attachment) {
              setAttachments(prev => [...prev, attachment]);
            }
          });
        }
      }
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const submitForm = () => {
    if ((!input.trim() && attachments.length === 0) || !canSend) return;

    onSendMessage({
      input: input.trim(),
      attachments,
    });
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitForm();
    }
  };

  // Animation states for generating
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  
  useEffect(() => {
    if (isGenerating) {
      let dots = '';
      const interval = setInterval(() => {
        dots = dots.length >= 3 ? '' : dots + '.';
        setAnimatedPlaceholder(`Generating response${dots}`);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setAnimatedPlaceholder('');
    }
  }, [isGenerating]);

  return (
    <div
      data-testid="multimodal-input"
      className={twMerge(
        'relative w-full overflow-hidden rounded-xl border p-2 shadow-sm transition-all duration-300 ease-in-out',
        isGenerating
          ? 'border-cyan-400/50 shadow-cyan-400/20 shadow-lg animate-pulse' 
          : isFocused
          ? 'border-gray-500 shadow-lg'
          : 'border-transparent',
        'bg-[#2d2f2f]',
        className,
      )}
      style={{
        boxShadow: isGenerating 
          ? '0 0 20px rgba(34, 211, 238, 0.15), 0 0 40px rgba(34, 211, 238, 0.1)' 
          : isFocused 
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : undefined
      }}
    >
      <AnimatePresence>
        {showSuggestedActions && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <PureSuggestedActions
              chatId={chatId}
              onSelectAction={handleSelectAction}
              selectedVisibilityType={selectedVisibilityType}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mb-2"
          >
            <div
              data-testid="attachments-preview"
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
            >
              {attachments.map((attachment, index) => (
                <PreviewAttachment key={index} attachment={attachment} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex w-full items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          onPaste={handlePaste}
          placeholder={isGenerating ? animatedPlaceholder : "Ask me anything..."}
          aria-label="Chat input"
          className={twMerge(
            "pr-24 transition-all duration-300",
            isGenerating && "opacity-70 cursor-not-allowed"
          )}
          rows={1}
          disabled={isGenerating}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <PureAttachmentsButton
            fileInputRef={fileInputRef}
            disabled={isGenerating || uploadQueue.length > 0}
          />
          <PureSendButton
            submitForm={submitForm}
            input={input}
            uploadQueue={uploadQueue}
            attachments={attachments}
            canSend={canSend}
            isGenerating={isGenerating}
          />
          <PureStopButton onStop={onStopGenerating} />
        </div>
      </div>
    </div>
  );
}

const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  return equal(prevProps, nextProps);
});

export { MultimodalInput, PureMultimodalInput }; 