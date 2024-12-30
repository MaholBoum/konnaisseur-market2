import { Input } from '@/components/ui/input';

interface TelegramInputProps {
  username: string;
  onUsernameChange: (value: string) => void;
}

export const PhoneInput = ({ username, onUsernameChange }: TelegramInputProps) => {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Enter your Telegram username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        className="mb-2"
      />
      <p className="text-sm text-gray-500 italic">
        Enter your Telegram username someone will get in touch after payment confirmation
      </p>
    </div>
  );
};