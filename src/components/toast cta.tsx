import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  // Determine icon and color based on message content
  const isError = message.toLowerCase().includes('erro') || message.toLowerCase().includes('error') || message.toLowerCase().includes('falha');
  const isSuccess = message.toLowerCase().includes('sucesso') || message.toLowerCase().includes('success') || message.toLowerCase().includes('cadastrado');

  const icon = isError ? AlertCircle : isSuccess ? CheckCircle : Info;
  const bgColor = isError ? 'bg-red-500' : isSuccess ? 'bg-[#4ADE80]' : 'bg-[#0D3B2E]';
  const textColor = 'text-white';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-4 right-4 ${bgColor} ${textColor} p-4 rounded-2xl shadow-[0_10px_40px_rgba(13,59,46,0.3)] z-50 flex items-center gap-3 max-w-sm`}
      >
        <icon className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

export function useToast() {
  const [message, setMessage] = useState('');

  const showToast = (msg: string) => setMessage(msg);

  return { message, showToast };
}