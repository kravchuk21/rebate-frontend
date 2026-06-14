import { LocaleSwitcher } from '@/shared/components/LocaleSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-full max-w-md px-4 flex justify-end">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
