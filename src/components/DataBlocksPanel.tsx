'use client';

import React, { useState, useEffect } from 'react';
import { X, Type, Layers, Image as ImageIcon, Save, Briefcase } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function DataBlocksPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'text' | 'blocks' | 'media' | 'jobs'>('text');
  
  // Custom states for content
  const [heroTitle, setHeroTitle] = useState('КОМПЛЕКСНЫЕ \nИНЖЕНЕРНЫЕ ИЗЫСКАНИЯ');
  const [heroSubtitle, setHeroSubtitle] = useState('И ПРОЕКТИРОВАНИЕ ПОД КЛЮЧ');
  const [heroDesc, setHeroDesc] = useState('Безупречная точность на каждом этапе. От геологии до сложнейших строительных экспертиз по всей территории РФ.');
  const [heroImage, setHeroImage] = useState('');
  const [labImage, setLabImage] = useState('');

  // Lab textual content
  const [labTitle, setLabTitle] = useState('НЕ ТОЛЬКО СКОРОСТЬ, \nНО И АБСОЛЮТНАЯ ТОЧНОСТЬ');
  const [labDesc, setLabDesc] = useState('Мы не передаем материалы на аутсорс. Собственный парк высокоточной техники и аккредитованная грунтовая лаборатория позволяют нам контролировать качество на каждом миллиметре исследуемой среды.');
  const [labList, setLabList] = useState('Грунтовая лаборатория\nЭкологический контроль\nОтдел 3D сканирования');

  // Contact textual content
  const [contactTitle, setContactTitle] = useState('НАПИШИТЕ НАМ \nДЛЯ ОЦЕНКИ');
  const [contactDesc, setContactDesc] = useState('Отправьте техническое задание, и наши ГИПы свяжутся с вами в течение 2 часов с готовым коммерческим предложением.');
  
  // Custom states for Services (Blocks)
  const [services, setServices] = useState([
    { id: 1, title: 'Инженерно-геодезические', desc: 'Топографическая съемка любых масштабов, создание геодезических сетей и трассирование линейных сооружений.', details: 'Мы проводим весь комплекс топографо-геодезических работ. В нашем арсенале современные тахеометры, GNSS-приемники, цифровые нивелиры и беспилотные летательные аппараты (БПЛА) для аэрофотосъемки.' },
    { id: 2, title: 'Инженерно-геологические', desc: 'Бурение скважин, полевые испытания грунтов, лабораторные исследования и оценка геологических рисков.', details: 'Изучение строения массива горных пород, состояния и свойств грунтов. Мы осуществляем бурение любой сложности, статическое и динамическое зондирование, штамповые испытания.' },
    { id: 3, title: 'Экологические изыскания', desc: 'Исследование радиационной обстановки, анализ почв, грунтов, воздуха и воды для экологической безопасности.', details: 'Комплексное изучение компонентов окружающей среды. Проводим маршрутные наблюдения, экологическое опробование, оценку физических воздействий (шум, ЭМИ), радиационный контроль.' },
    { id: 4, title: 'Проектирование', desc: 'Разработка проектной и рабочей документации, BIM-моделирование и авторский надзор.', details: 'Разрабатываем полный комплект проектно-сметной документации для объектов любой сложности. Внедряем современные BIM-технологии для исключения коллизий на этапе стройки.' }
  ]);
  
  // Custom states for Jobs (Vacancies)
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Инженер-геодезист', status: 'ОТКРЫТА', desc: 'Требуется специалист с опытом полевых работ (тахеометры, GNSS) и камельной обработки. Командировки по РФ.' },
    { id: 2, title: 'Инженер-геолог', status: 'ОТКРЫТА', desc: 'Описание грунтовых массивов, ведение документации, взаимодействие с лабораторией. Умение работать в специализированном ПО.' }
  ]);

  // Database instance
  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;
    
    // Load content directly from Supabase Cloud
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'main_page')
        .single();
        
      if (data && !error) {
        if (data.hero_title) setHeroTitle(data.hero_title);
        if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        if (data.hero_desc) setHeroDesc(data.hero_desc);
        if (data.hero_image) setHeroImage(data.hero_image);
        if (data.lab_image) setLabImage(data.lab_image);
        
        if (data.lab_title) setLabTitle(data.lab_title);
        if (data.lab_desc) setLabDesc(data.lab_desc);
        if (data.lab_list) setLabList(data.lab_list);
        if (data.contact_title) setContactTitle(data.contact_title);
        if (data.contact_desc) setContactDesc(data.contact_desc);
        // Parse services if they exist (storing as JSON string in text field for simplicity)
        if (data.services_json) {
          try {
            setServices(JSON.parse(data.services_json));
          } catch(e) {}
        }
        if (data.jobs_json) {
          try {
            setJobs(JSON.parse(data.jobs_json));
          } catch(e) {}
        }
      }
    };
    
    loadContent();
  }, [isOpen]);

  const saveContent = async () => {
    // 1. Save directly to Cloud Database
    const { error } = await supabase
      .from('site_content')
      .upsert({ 
        id: 'main_page', 
        hero_title: heroTitle, 
        hero_subtitle: heroSubtitle, 
        hero_desc: heroDesc,
        hero_image: heroImage,
        lab_image: labImage,
        lab_title: labTitle,
        lab_desc: labDesc,
        lab_list: labList,
        contact_title: contactTitle,
        contact_desc: contactDesc,
        services_json: JSON.stringify(services),
        jobs_json: JSON.stringify(jobs),
        updated_at: new Date()
      });

    if (!error) {
       // 2. Dispatch custom event to notify components to update without reload
       window.dispatchEvent(new Event('site_content_updated'));
    } else {
       console.error("Failed to save to Supabase:", error);
       alert("ОШИБКА БАЗЫ ДАННЫХ: " + JSON.stringify(error, null, 2));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1a1d24] border-l border-white/10 shadow-2xl z-[200] flex flex-col transform transition-transform duration-500 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 h-20 shrink-0">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#e3cdb2]">CMS КОНТЕНТ</h2>
          <p className="text-xs text-white/50 font-medium mt-1">Данные и Блоки</p>
        </div>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'text' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Type className="w-4 h-4" /> Тексты
        </button>
        <button 
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'blocks' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Layers className="w-4 h-4" /> Услуги
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'jobs' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Briefcase className="w-4 h-4" /> Вакансии
        </button>
        <button 
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'media' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <ImageIcon className="w-4 h-4" /> Медиа
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {activeTab === 'text' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Главный Заголовок (Hero)</label>
              <textarea 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Доп. Заголовок (Hero Подпись)</label>
              <input 
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Описание (Hero Parapgraph)</label>
              <textarea 
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-32"
              />
            </div>

            <div className="w-full h-px bg-white/10 my-8"></div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Заголовок: Лаборатория</label>
              <textarea 
                value={labTitle}
                onChange={(e) => setLabTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Описание: Лаборатория</label>
              <textarea 
                value={labDesc}
                onChange={(e) => setLabDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Список: Лаборатория (каждый пункт с новой строки)</label>
              <textarea 
                value={labList}
                onChange={(e) => setLabList(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-32"
                placeholder="Пример:&#10;Пункт 1&#10;Пункт 2"
              />
            </div>

            <div className="w-full h-px bg-white/10 my-8"></div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Заголовок: Контакты</label>
              <textarea 
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold block mb-2">Текст: Контакты</label>
              <textarea 
                value={contactDesc}
                onChange={(e) => setContactDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#e3cdb2] focus:border-[#e3cdb2] transition-colors resize-none h-24"
              />
            </div>
          </div>
        )}

        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Направления / Услуги</h3>
            
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={service.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 relative group">
                  <button 
                    onClick={() => {
                      const newServices = [...services];
                      newServices.splice(index, 1);
                      setServices(newServices);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/10 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Название</label>
                    <input 
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].title = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Описание карточки</label>
                    <textarea 
                      value={service.desc}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].desc = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1 resize-none h-16"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Подробное описание (внутри окна)</label>
                    <textarea 
                      value={service.details || ''}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].details = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1 resize-none h-16"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setServices([...services, { id: Date.now(), title: 'НОВОЕ НАПРАВЛЕНИЕ', desc: 'Краткое описание...', details: 'Подробное описание...' }]);
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed text-white transition-all font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2"
            >
               + Добавить услугу
            </button>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Открытые вакансии</h3>
            
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 relative group">
                  <button 
                    onClick={() => {
                      const newJobs = [...jobs];
                      newJobs.splice(index, 1);
                      setJobs(newJobs);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/10 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Должность / Вакансия</label>
                    <input 
                      type="text"
                      value={job.title}
                      onChange={(e) => {
                        const newJobs = [...jobs];
                        newJobs[index].title = e.target.value;
                        setJobs(newJobs);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Статус бейджа</label>
                    <input 
                      type="text"
                      value={job.status}
                      onChange={(e) => {
                        const newJobs = [...jobs];
                        newJobs[index].status = e.target.value;
                        setJobs(newJobs);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#e3cdb2] font-bold">Описание и требования</label>
                    <textarea 
                      value={job.desc}
                      onChange={(e) => {
                        const newJobs = [...jobs];
                        newJobs[index].desc = e.target.value;
                        setJobs(newJobs);
                      }}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white focus:outline-none focus:border-[#e3cdb2] transition-colors mt-1 resize-none h-16"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setJobs([...jobs, { id: Date.now(), title: 'НОВАЯ ВАКАНСИЯ', status: 'ОТКРЫТА', desc: 'Краткое описание...' }]);
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed text-white transition-all font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2"
            >
               + Добавить вакансию
            </button>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold">Главный Фон (Hero)</h3>
                
                {heroImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/50">
                    <img src={heroImage} alt="Hero bg" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setHeroImage('')}
                        className="px-4 py-2 bg-red-500/80 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500 transition-colors"
                      >
                        Удалить фото
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/20 hover:border-[#e3cdb2]/50 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                     <ImageIcon className="w-10 h-10 text-white/30 group-hover:text-[#e3cdb2] mb-3 transition-colors" />
                     <span className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Загрузить JPG / PNG</span>
                     <input 
                       type="file" 
                       accept="image/*"
                       className="hidden"
                       onChange={async (e) => {
                         const file = e.target.files?.[0];
                         if (!file) return;
                         
                         const fileExt = file.name.split('.').pop();
                         const fileName = `hero-bg-${Date.now()}.${fileExt}`;
                         
                         const { data, error } = await supabase.storage
                           .from('media')
                           .upload(`hero/${fileName}`, file, { cacheControl: '3600', upsert: false });
                           
                         if (!error && data) {
                           const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`hero/${fileName}`);
                           setHeroImage(publicUrl);
                         } else {
                           alert("Ошибка загрузки файла. Проверьте права access в Storage.");
                         }
                       }}
                     />
                  </label>
                )}
             </div>

             <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold">Фон "Собственная Лаборатория"</h3>
                
                {labImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/50">
                    <img src={labImage} alt="Lab bg" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setLabImage('')}
                        className="px-4 py-2 bg-red-500/80 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500 transition-colors"
                      >
                        Удалить фото
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/20 hover:border-[#e3cdb2]/50 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                     <ImageIcon className="w-10 h-10 text-white/30 group-hover:text-[#e3cdb2] mb-3 transition-colors" />
                     <span className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Загрузить JPG / PNG</span>
                     <input 
                       type="file" 
                       accept="image/*"
                       className="hidden"
                       onChange={async (e) => {
                         const file = e.target.files?.[0];
                         if (!file) return;
                         
                         const fileExt = file.name.split('.').pop();
                         const fileName = `lab-bg-${Date.now()}.${fileExt}`;
                         
                         const { data, error } = await supabase.storage
                           .from('media')
                           .upload(`hero/${fileName}`, file, { cacheControl: '3600', upsert: false });
                           
                         if (!error && data) {
                           const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`hero/${fileName}`);
                           setLabImage(publicUrl);
                         } else {
                           alert("Ошибка загрузки файла.");
                         }
                       }}
                     />
                  </label>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-[#111418] shrink-0">
        <button 
          onClick={() => {
            saveContent();
            
            // Visual feedback
            const btn = document.getElementById('btn-save-content');
            if(btn) {
              const prev = btn.innerHTML;
              btn.innerHTML = '<span class="flex items-center gap-2 justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> СОХРАНЕНО</span>';
              btn.classList.add('bg-green-600', 'text-white');
              btn.classList.remove('bg-[#e3cdb2]', 'text-[#1a1d24]');
              setTimeout(() => {
                btn.innerHTML = prev;
                btn.classList.remove('bg-green-600', 'text-white');
                btn.classList.add('bg-[#e3cdb2]', 'text-[#1a1d24]');
              }, 1500);
            }
          }}
          id="btn-save-content"
          className="w-full py-4 bg-[#e3cdb2] hover:bg-white text-[#1a1d24] transition-all font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Сохранить тексты
        </button>
      </div>
    </div>
  );
}
