'use client';

import React, { useState } from 'react';
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

interface CertificateModalProps {
  cert: Certificate;
  onClose: () => void;
}

function CertificateModal({ cert, onClose }: CertificateModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-20"
          >
            <X size={20} className="text-slate-600" />
          </button>

          {/* PDF Viewer */}
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50">
              <Document
                file={cert.pdf}
                loading={
                  <div className="h-96 flex items-center justify-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Loading certificate...</span>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 80 : 560, 560)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{cert.title}</h3>
              <p className="text-slate-500">{cert.subtitle}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CertificateCard({ cert, onClick, delay }: { cert: Certificate; onClick: () => void; delay: number }) {
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
        className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg hover:shadow-2xl hover:shadow-sky-200/50 transition-shadow duration-500"
      >
        {/* Certificate Preview */}
        <div className="relative w-full flex items-center justify-center bg-slate-50 overflow-hidden" style={{ minHeight: 280 }}>
          <Document
            file={cert.pdf}
            loading={
              <div className="h-64 flex items-center justify-center text-slate-300">
                <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={320}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-sky-600/20 backdrop-blur-[2px] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: hovered ? 1 : 0.7, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
              className="bg-white rounded-full p-4 shadow-xl"
            >
              <ZoomIn size={28} className="text-sky-600" />
            </motion.div>
          </motion.div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-5 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{cert.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{cert.subtitle}</p>
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
              Our commitment to empowering the academic journey is validated by prestigious awards and industry recognition. Click any certificate to view it in full.
            </p>
          </motion.div>

          {/* Certificate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Modal */}
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </>
  );
}
