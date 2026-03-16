"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Phone, Mail, Building2, Map, HardHat, FileText, X } from 'lucide-react';
import { useAdmin } from '@/components/AdminProvider';
import { createClient } from '@/utils/supabase/client';

export default function DesignTwo() {
  const { openLoginModal } = useAdmin();
  const [activeService, setActiveService] = useState<{title: string, desc: string, details: string} | null>(null);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

  // Dynamic Content States
  const [heroContent, setHeroContent] = useState({
    title: 'КОМПЛЕКСНЫЕ \nИНЖЕНЕРНЫЕ ИЗЫСКАНИЯ',
    subtitle: 'И ПРОЕКТИРОВАНИЕ ПОД КЛЮЧ',
    desc: 'Безупречная точность на каждом этапе. От геологии до сложнейших строительных экспертиз по всей территории РФ.',
    image: 'https://images.unsplash.com/photo-1541888081622-127e997f02d4?q=80&w=2070&auto=format&fit=crop',
    labImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
    labTitle: 'НЕ ТОЛЬКО СКОРОСТЬ, \nНО И АБСОЛЮТНАЯ ТОЧНОСТЬ',
    labDesc: 'Мы не передаем материалы на аутсорс. Собственный парк высокоточной техники и аккредитованная грунтовая лаборатория позволяют нам контролировать качество на каждом миллиметре исследуемой среды.',
    labList: 'Грунтовая лаборатория\nЭкологический контроль\nОтдел 3D сканирования',
    contactTitle: 'НАПИШИТЕ НАМ \nДЛЯ ОЦЕНКИ',
    contactDesc: 'Отправьте техническое задание, и наши ГИПы свяжутся с вами в течение 2 часов с готовым коммерческим предложением.'
  });

  const [servicesContent, setServicesContent] = useState<{id: number, title: string, desc: string, details?: string}[]>([
    {
      id: 1,
      title: "Инженерно-геодезические",
      desc: "Топографическая съемка любых масштабов, создание геодезических сетей и трассирование линейных сооружений.",
      details: "Мы проводим весь комплекс топографо-геодезических работ."
    },
    {
      id: 2,
      title: "Инженерно-геологические",
      desc: "Бурение скважин, полевые испытания грунтов, лабораторные исследования и оценка геологических рисков.",
      details: "Изучение строения массива горных пород."
    },
    {
      id: 3,
      title: "Экологические изыскания",
      desc: "Исследование радиационной обстановки, анализ почв, грунтов, воздуха и воды для экологической безопасности.",
      details: "Комплексное изучение компонентов окружающей среды."
    },
    {
      id: 4,
      title: "Проектирование",
      desc: "Разработка проектной и рабочей документации, BIM-моделирование и авторский надзор.",
      details: "Разрабатываем полный комплект проектно-сметной документации."
    }
  ]);

  const [jobsContent, setJobsContent] = useState<{id: number, title: string, status: string, desc: string}[]>([
    { id: 1, title: 'Инженер-геодезист', status: 'ОТКРЫТА', desc: 'Требуется специалист с опытом полевых работ (тахеометры, GNSS) и камельной обработки. Командировки по РФ.' },
    { id: 2, title: 'Инженер-геолог', status: 'ОТКРЫТА', desc: 'Описание грунтовых массивов, ведение документации, взаимодействие с лабораторией. Умение работать в специализированном ПО.' }
  ]);

  // Load dynamic content
  useEffect(() => {
    const supabase = createClient();
    
    const loadContent = async () => {
      // Fetch from Supabase cloud
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'main_page')
        .single();

      if (data && !error) {
        setHeroContent({
          title: data.hero_title || 'КОМПЛЕКСНЫЕ \nИНЖЕНЕРНЫЕ ИЗЫСКАНИЯ',
          subtitle: data.hero_subtitle || 'И ПРОЕКТИРОВАНИЕ ПОД КЛЮЧ',
          desc: data.hero_desc || 'Безупречная точность на каждом этапе. От геологии до сложнейших строительных экспертиз по всей территории РФ.',
          image: data.hero_image || 'https://images.unsplash.com/photo-1541888081622-127e997f02d4?q=80&w=2070&auto=format&fit=crop',
          labImage: data.lab_image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
          labTitle: data.lab_title || 'НЕ ТОЛЬКО СКОРОСТЬ, \nНО И АБСОЛЮТНАЯ ТОЧНОСТЬ',
          labDesc: data.lab_desc || 'Мы не передаем материалы на аутсорс. Собственный парк высокоточной техники и аккредитованная грунтовая лаборатория позволяют нам контролировать качество на каждом миллиметре исследуемой среды.',
          labList: data.lab_list || 'Грунтовая лаборатория\nЭкологический контроль\nОтдел 3D сканирования',
          contactTitle: data.contact_title || 'НАПИШИТЕ НАМ \nДЛЯ ОЦЕНКИ',
          contactDesc: data.contact_desc || 'Отправьте техническое задание, и наши ГИПы свяжутся с вами в течение 2 часов с готовым коммерческим предложением.'
        });

        if (data.services_json) {
           try {
              setServicesContent(JSON.parse(data.services_json));
           } catch(e){}
        }

        if (data.jobs_json) {
           try {
              setJobsContent(JSON.parse(data.jobs_json));
           } catch(e){}
        }
      }
    };
    
    // Initial load
    loadContent();

    // Listen to admin panel saves
    window.addEventListener('site_content_updated', loadContent);
    return () => window.removeEventListener('site_content_updated', loadContent);
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        setActiveService(null);
        setIsJobsModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeService || isJobsModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; }
  }, [activeService, isJobsModalOpen]);

  return (
    <main className="min-h-screen bg-[#F8F8F8] text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-[#801C1C] selection:text-white">
      
      {/* 1. Header (Static/Sticky Representation) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-[#F3F4ED]/90 backdrop-blur-md border-b border-[#7B9E78]/20 transition-all">
        <div className="flex items-center gap-2 text-[var(--color-dark)]">
          <div className="w-8 h-8 bg-[#7B9E78] text-white flex items-center justify-center font-display font-bold text-lg rounded-sm">V</div>
          <span className="font-display font-bold tracking-widest uppercase text-lg">PIF VOZROJDENIE</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wider text-[var(--color-dark-muted)] uppercase">
          <a href="#services" className="hover:text-[var(--color-dark)] transition-colors">Услуги</a>
          <a href="#about" className="hover:text-[var(--color-dark)] transition-colors">О компании</a>
          <a href="#projects" className="hover:text-[var(--color-dark)] transition-colors">Проекты</a>
          
          {/* Active Glowing Jobs Button */}
          <button 
            onClick={() => setIsJobsModalOpen(true)}
            className="group relative flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors font-bold"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
            </span>
            Ищем сотрудника
          </button>
        </nav>

        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Beautiful Huge Email */}
          <a 
            href="mailto:vozrojdenie@bk.ru" 
            className="hidden xl:flex items-center group"
          >
            <span className="font-display font-black text-xl tracking-wider text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-all uppercase drop-shadow-sm">
              vozrojdenie@bk.ru
            </span>
          </a>

          <div className="hidden md:flex flex-col text-right text-[var(--color-dark)] border-l border-[#7B9E78]/30 pl-6 lg:pl-8">
            <span className="text-sm font-bold font-display">+7 (8212) 24-23-38</span>
            <span className="text-xs text-[#7B9E78] cursor-pointer hover:underline">Перезвоните мне</span>
          </div>
          <button 
            onClick={() => { document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hidden sm:flex px-6 py-2.5 bg-transparent border border-[#7B9E78] text-[var(--color-dark)] hover:bg-[#7B9E78] hover:text-white transition-all font-semibold uppercase text-xs tracking-widest rounded-sm"
          >
            Оставить заявку
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative w-full h-screen bg-[#F3F4ED] flex items-center justify-start overflow-hidden pt-20">
        {/* Background Image: No overlays, 100% natural, not cropped */}
        <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center overflow-hidden">
          <img 
             src={heroContent.image || "/hero-bg.jpg"}
             alt="Industrial Background" 
             className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 w-full max-w-7xl">
          <div className="inline-block px-4 py-2 mb-6 border border-[#7B9E78]/80 text-[var(--color-dark)] text-xs font-bold uppercase tracking-widest rounded-sm bg-white/80 backdrop-blur-sm shadow-md">
            Индустриальный стандарт качества
          </div>
          
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 max-w-3xl mb-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-[var(--color-dark)] uppercase tracking-tighter leading-[1.05] mb-6">
              <span className="whitespace-pre-wrap">{heroContent.title}</span> <br />
              <span className="text-xl md:text-3xl lg:text-4xl text-[#3A4A3A] mt-2 inline-block whitespace-pre-wrap">{heroContent.subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-[#2F442F] font-sans leading-relaxed border-l-4 border-[#7B9E78] pl-6 font-semibold bg-white/40 py-2 rounded-r-md whitespace-pre-wrap">
              {heroContent.desc}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button className="px-8 py-4 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 rounded-sm shadow-[0_4px_14px_rgba(104,138,100,0.4)] hover:shadow-[0_6px_20px_rgba(104,138,100,0.6)] hover:-translate-y-0.5">
              Обсудить проект <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-24 z-10 flex items-center gap-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-xs uppercase tracking-widest rotate-[-90deg] origin-left translate-y-8 font-bold">Scroll</span>
          <div className="w-[2px] h-16 bg-white/40 relative overflow-hidden shadow-sm">
            <div className="w-full h-1/2 bg-white absolute top-0 animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* 3. Services Grid Section */}
      <section id="services" className="py-24 md:py-32 bg-white relative">
        <div className="px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tight text-[var(--color-dark)]">
              НАШИ НАПРАВЛЕНИЯ
            </h2>
            <p className="max-w-md text-[var(--color-dark-muted)] text-lg">
              Мы предоставляем полный спектр услуг для получения разрешения на строительство и прохождения экспертизы.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[#E2E8E0]">
            {servicesContent.map((svc, idx) => {
               // Assign icons dynamically based on index for aesthetic purposes
               const icons = [
                  <Map key={1} className="w-10 h-10 mb-6 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors" />,
                  <HardHat key={2} className="w-10 h-10 mb-6 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors" />,
                  <Building2 key={3} className="w-10 h-10 mb-6 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors" />,
                  <FileText key={4} className="w-10 h-10 mb-6 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors" />
               ];
               const Icn = icons[idx % icons.length];
               const numStr = (idx + 1).toString().padStart(2, '0');

               return (
                  <ServiceBlock 
                    key={svc.id}
                    number={numStr}
                    icon={Icn}
                    title={svc.title}
                    desc={svc.desc}
                    onClick={() => setActiveService({
                      title: svc.title,
                      desc: svc.desc,
                      details: svc.details || "Запрос дополнительной технической информации по данному направлению доступен после оформления технического задания."
                    })}
                  />
               );
            })}
          </div>
        </div>
      </section>

      {/* 4. The 50/50 Laboratory / About Section */}
      <section id="about" className="w-full bg-[#F3F4ED] text-[var(--color-dark)] flex flex-col lg:flex-row border-y border-[#E2E8E0]">
        {/* Left: Vintage Warm Overlay Image */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto min-h-[600px] relative">
          <div className="absolute inset-0 bg-[#A3B89E] mix-blend-multiply z-10 opacity-40"></div>
          <img 
            src={heroContent.labImage} 
            alt="Laboratory" 
            className="w-full h-full object-cover filter sepia-[.2]"
          />
          <div className="absolute bottom-10 left-10 z-20">
            <h3 className="text-4xl md:text-6xl font-display font-black uppercase text-white/90 drop-shadow-lg">Собственная <br/> Лаборатория</h3>
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 md:p-20 lg:p-24 bg-[#FAFAF7]">
          <div className="w-16 h-1 bg-[var(--color-primary)] mb-8"></div>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter mb-8 leading-tight text-[var(--color-dark)] whitespace-pre-wrap">
            {heroContent.labTitle}
          </h2>
          <p className="text-lg text-[var(--color-dark-muted)] mb-6 leading-relaxed font-medium">
            {heroContent.labDesc}
          </p>
          <ul className="space-y-4 mb-10 border-t border-[#E2E8E0] pt-8 mt-4">
            {heroContent.labList.split('\n').filter(i => i.trim() !== '').map((item, idx) => (
               <li key={idx} className="flex items-center gap-4 text-[var(--color-dark)] font-bold uppercase tracking-wider text-sm">
                 <ChevronRight className="text-[var(--color-primary)]" /> {item}
               </li>
            ))}
          </ul>
          <button className="self-start px-8 py-4 bg-transparent border border-[#7B9E78] text-[var(--color-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-bold uppercase tracking-wider text-sm rounded-sm">
            Узнать о компании
          </button>
        </div>
      </section>

      {/* 5. Natural Warm CTA Section */}
      <section id="contacts" className="py-24 md:py-32 bg-[#A3B89E] relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FAFAF7]/30 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row justify-between gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase text-[#1C261C] tracking-tighter mb-6 whitespace-pre-wrap">
              {heroContent.contactTitle}
            </h2>
            <p className="text-[var(--color-dark)] text-xl font-sans mb-12 max-w-md leading-relaxed font-medium">
              {heroContent.contactDesc}
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-[#1C261C]">
                <div className="w-12 h-12 border border-[var(--color-dark)]/20 bg-white/30 flex items-center justify-center shrink-0 rounded-sm">
                  <Phone className="w-5 h-5 text-[#1C261C]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[var(--color-dark)] font-bold mb-1">Звонок ГИПу</div>
                  <div className="text-xl font-bold font-display">+7 (8212) 24-23-38</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[#1C261C]">
                <div className="w-12 h-12 border border-[var(--color-dark)]/20 bg-white/30 flex items-center justify-center shrink-0 rounded-sm">
                  <Mail className="w-5 h-5 text-[#1C261C]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[var(--color-dark)] font-bold mb-1">Электронная почта</div>
                  <div className="text-xl font-bold font-display">vozrojdenie@bk.ru</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 bg-white p-10 md:p-14 rounded-xl shadow-[0_20px_40px_rgba(42,59,42,0.1)] border border-[#E2E8E0]">
            <form className="flex flex-col gap-8">
              <div className="relative">
                <input 
                  type="text" 
                  id="name"
                  placeholder="Ваше имя / Компания"
                  className="w-full bg-transparent border-b border-[#D0D6CD] pb-4 text-[#1A1A1A] placeholder-[#8A9C87] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-sans"
                />
              </div>
              <div className="relative">
                <input 
                  type="tel" 
                  id="phone"
                  placeholder="Контактный телефон"
                  className="w-full bg-transparent border-b border-[#D0D6CD] pb-4 text-[#1A1A1A] placeholder-[#8A9C87] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-sans"
                />
              </div>
              <div className="relative">
                <textarea 
                  id="message"
                  placeholder="Краткое описание объекта или задачи"
                  rows={3}
                  className="w-full bg-transparent border-b border-[#D0D6CD] pb-4 text-[#1A1A1A] placeholder-[#8A9C87] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-sans resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 px-8 py-5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors font-bold uppercase tracking-widest text-sm w-full rounded-sm shadow-md"
              >
                Отправить запрос
              </button>
              <p className="text-xs text-[#8A9C87] text-center font-sans font-medium">
                Нажимая на кнопку, вы даете согласие на обработку персональных данных.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="bg-[var(--color-dark)] text-[#A3B89E] py-8 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs uppercase tracking-widest font-semibold flex items-center gap-3">
          <button 
            onClick={openLoginModal} 
            className="w-2 h-2 rounded-full bg-[#A3B89E] opacity-30 hover:opacity-100 hover:scale-150 transition-all duration-300 pointer-events-auto"
            title="Вход для администратора"
          />
          © {new Date().getFullYear()} ООО ПИФ "ВОЗРОЖДЕНИЕ"
        </p>
        <p className="text-xs uppercase tracking-widest font-semibold">Разработка PIF Nature Design</p>
      </footer>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors rounded-full shadow-2xl flex items-center justify-center z-50 text-white border border-white/20 hover:scale-105 active:scale-95 duration-200">
        <Phone className="w-5 h-5 fill-current" />
      </button>

      {/* Service Block Detail Modal */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500 ${activeService ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[var(--color-dark)]/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveService(null)}></div>
        
        {/* Modal Window */}
        <div className={`relative w-full max-w-3xl bg-[#FAFAF7] shadow-2xl rounded-xl overflow-hidden transition-all duration-500 transform ${activeService ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
          <div className="p-6 sm:p-8 md:p-14">
            <button 
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-[#E2E8E0]/50 hover:bg-[var(--color-primary)] text-[var(--color-dark)] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-1 bg-[var(--color-primary)] mb-6 md:mb-8 mt-2"></div>
            <h3 className="text-[1.35rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-[var(--color-dark)] uppercase mb-6">
              {activeService?.title}
            </h3>
            
            <div className="text-xl text-[var(--color-dark)] font-medium leading-relaxed mb-8 border-l-4 border-[#7B9E78] pl-6 py-2 bg-[#F3F4ED] rounded-r-md">
              {activeService?.desc}
            </div>

            <div className="text-[var(--color-dark-muted)] text-lg leading-relaxed space-y-4 font-sans border-t border-[#E2E8E0] pt-8">
              <p>{activeService?.details}</p>
            </div>

            <button 
              onClick={() => {
                setActiveService(null);
                setTimeout(() => {
                  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
                }, 400);
              }}
              className="mt-10 px-8 py-4 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all font-bold uppercase tracking-wider text-sm flex items-center gap-3 rounded-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Заказать услугу <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Jobs / Vacancy Modal */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500 ${isJobsModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[var(--color-dark)]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsJobsModalOpen(false)}></div>
        
        {/* Modal Window */}
        <div className={`relative w-full max-w-2xl bg-[#FAFAF7] shadow-2xl rounded-xl overflow-hidden transition-all duration-500 transform ${isJobsModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
          <div className="p-6 sm:p-8 md:p-14">
            <button 
              onClick={() => setIsJobsModalOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-[#E2E8E0]/50 hover:bg-[var(--color-primary)] text-[var(--color-dark)] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-1 bg-[var(--color-primary)] mb-6 md:mb-8 mt-2"></div>
            <h3 className="text-[1.15rem] leading-[1.3] xsm:text-[1.35rem] sm:text-3xl md:text-4xl font-black font-display text-[var(--color-dark)] uppercase mb-6">
              ПРИСОЕДИНИТЬСЯ <br className="hidden sm:block" />К КОМАНДЕ
            </h3>
            
            <div className="text-xl text-[var(--color-dark)] font-medium leading-relaxed mb-8 border-l-4 border-[#7B9E78] pl-6 py-2 bg-[#F3F4ED] rounded-r-md">
              В связи с расширением проектов мы находимся в поиске квалифицированных специалистов.
            </div>

            <div className="text-[var(--color-dark-muted)] flex flex-col gap-6 text-sm md:text-base leading-relaxed font-sans border-t border-[#E2E8E0] pt-8">
              {jobsContent.length > 0 ? jobsContent.map((job) => (
                <div key={job.id} className="flex flex-col gap-2 bg-white p-6 rounded-lg border border-[#E2E8E0] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-[var(--color-dark)] uppercase tracking-wider">{job.title}</h4>
                    <span className="px-3 py-1 bg-[#E2E8E0] text-[var(--color-dark-muted)] rounded-full text-xs font-bold">{job.status}</span>
                  </div>
                  <p>{job.desc}</p>
                </div>
              )) : (
                <div className="text-center italic">В данный момент нет открытых вакансий.</div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center gap-6">
              <a 
                href="mailto:vozrojdenie@bk.ru"
                className="px-8 py-4 bg-[var(--color-primary)] w-full sm:w-auto text-center text-white hover:bg-[var(--color-primary-hover)] transition-all font-bold uppercase tracking-wider text-sm rounded-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Отправить резюме
              </a>
              <span className="text-sm font-semibold text-[var(--color-dark-muted)]">
                или звоните: <span className="font-display font-bold text-[var(--color-dark)]">+7 (8212) 24-23-38</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

function ServiceBlock({ number, icon, title, desc, onClick }: { number: string, icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group p-10 lg:p-14 border-b border-r border-[#E2E8E0] bg-[#FAFAF7] hover:bg-white hover:shadow-[0_10px_40px_rgba(104,138,100,0.1)] transition-all duration-500 flex flex-col items-start relative overflow-hidden"
    >
      {/* Number Watermark */}
      <div className="absolute top-4 right-8 text-8xl font-black font-display text-[#7B9E78]/10 group-hover:text-[#7B9E78]/20 transition-colors duration-500 pointer-events-none select-none">
        {number}
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col">
        {icon}
        <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 mt-auto text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors duration-500">
          {title}
        </h3>
        <p className="text-[var(--color-dark-muted)] text-sm leading-relaxed mb-8 font-medium">
          {desc}
        </p>
        
        <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] group-hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer w-fit">
          Подробнее <ArrowRight className="w-4 h-4 ml-2 transition-transform transform group-hover:translate-x-2" />
        </div>
      </div>
    </div>
  );
}
