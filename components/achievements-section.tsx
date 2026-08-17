'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, ZoomIn } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker — only in browser context
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface Certificate {
  pdf: string;
  title: string;
  subtitle: string;
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(400);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function CertificateModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  // Responsive modal width: max 90vw, max 800px
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X size={18} className="text-slate-700" />
        </button>

        {/* PDF — fills modal width */}
        <div ref={containerRef} className="w-full flex justify-center bg-slate-50 overflow-hidden">
          <Document
            file={cert.pdf}
            loading={
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={containerWidth || 600}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white">
          <h3 className="text-xl font-bold text-slate-900">{cert.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{cert.subtitle}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CertificateCard({ cert, onClick, delay }: { cert: Certificate; onClick: () => void; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWidth = useContainerWidth(cardRef);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-xl hover:shadow-sky-200/40 transition-shadow duration-500"
      >
        {/* Landscape Certificate Preview — fills the card width naturally */}
        <div ref={cardRef} className="relative w-full overflow-hidden bg-slate-50">
          <Document
            file={cert.pdf}
            loading={
              <div className="h-48 flex items-center justify-center">
                <div className="w-7 h-7 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={cardWidth || 340}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {/* Click Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-sky-600/15 backdrop-blur-[1px] flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: hovered ? 1 : 0.7, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
              className="bg-white rounded-full p-3.5 shadow-xl"
            >
              <ZoomIn size={24} className="text-sky-600" />
            </motion.div>
          </motion.div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{cert.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{cert.subtitle}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    { pdf: '/certificates/cert1.pdf', title: 'Best Recruiter Award', subtitle: 'Recognizing outstanding dedication' },
    { pdf: '/certificates/cert2.pdf', title: "Line Manager's Achiever", subtitle: 'Excellence in leadership' },
    { pdf: '/certificates/cert3.pdf', title: 'Certificate of Appreciation', subtitle: 'Outstanding performance in recruitment' },
  ];

  return (
    <>
      <section className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-50 border border-sky-200 mb-6 shadow-sm">
              <Trophy size={16} className="text-sky-600" />
              <span className="text-sm font-bold text-sky-700 tracking-wider uppercase">Our Excellence</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight">
              Recognized <span className="gradient-text">Achievements</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Our commitment to empowering the academic journey is validated by prestigious awards and industry recognition.{' '}
              <span className="text-sky-600 font-medium">Click any certificate to view it in full.</span>
            </p>
          </motion.div>

          {/* Certificate Grid — landscape cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {certificates.map((cert, idx) => (
              <CertificateCard
                key={idx}
                cert={cert}
                onClick={() => setSelectedCert(cert)}
                delay={idx * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full-screen Responsive Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
