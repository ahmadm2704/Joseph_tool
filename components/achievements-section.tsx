'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Award, Trophy, Star } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker — only in browser context
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface CertificateCardProps {
  pdfUrl: string;
  title: string;
  subtitle: string;
  delay: number;
}

function Certificate3DCard({ pdfUrl, title, subtitle, delay }: CertificateCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12.5deg", "-12.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12.5deg", "12.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative group perspective-container"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[1/1.4] rounded-2xl glass-card overflow-hidden cursor-pointer"
      >
        {/* Glowing Background Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Certificate Rendering */}
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center transform-gpu" style={{ transform: "translateZ(30px)" }}>
          <div className="w-full h-full bg-white/5 rounded-xl border border-white/20 overflow-hidden shadow-2xl relative flex items-center justify-center">
            <Document 
              file={pdfUrl}
              loading={<div className="animate-pulse text-sky-600/50 flex flex-col items-center"><Award size={32} className="mb-2" />Loading...</div>}
              error={<div className="text-red-400">Failed to load certificate</div>}
            >
              <Page 
                pageNumber={1} 
                width={320} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                className="transition-transform duration-700 ease-out group-hover:scale-105 shadow-md"
              />
            </Document>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
          </div>
          
          <div className="mt-6 text-center" style={{ transform: "translateZ(50px)" }}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">{title}</h3>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const certificates = [
    { pdf: '/certificates/cert1.pdf', title: 'Best Recruiter Award', subtitle: 'Recognizing outstanding dedication' },
    { pdf: '/certificates/cert2.pdf', title: 'Line Manager\'s Achiever', subtitle: 'Excellence in leadership' },
    { pdf: '/certificates/cert3.pdf', title: 'Certificate of Appreciation', subtitle: 'Outstanding performance in recruitment' }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-slate-50">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-400/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full mesh-gradient opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/60 mb-6 border border-sky-200 shadow-sm">
            <Trophy className="text-sky-600" size={16} />
            <span className="text-sm font-bold text-sky-800 tracking-wider uppercase">Our Excellence</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Recognized <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our commitment to empowering the academic journey is validated by prestigious awards and industry recognition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {certificates.map((cert, idx) => (
            <Certificate3DCard 
              key={idx}
              pdfUrl={cert.pdf}
              title={cert.title}
              subtitle={cert.subtitle}
              delay={idx * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
