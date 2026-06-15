import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white dark:bg-[rgb(10,10,10)] text-black dark:text-white`}>{children}</body>
    </html>
  );
}
