import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  phoneNumber: string;
  onPhoneChange: (value: string) => void;
}

export const PhoneInput = ({ phoneNumber, onPhoneChange }: PhoneInputProps) => {
  return (
    <div className="space-y-2">
      <Input
        type="tel"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="mb-2"
      />
      <p className="text-sm text-gray-500 italic">
        Enter phone number to be called by an independent mailman
      </p>
    </div>
  );
};