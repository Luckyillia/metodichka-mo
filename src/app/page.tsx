'use client';

import { useState, Suspense, lazy } from 'react';
import Header from '@/app/components/Manual/Header';
import Sidebar from '@/app/components/Manual/Sidebar';
import { navItems, sections } from '@/data/manualData';
import OverviewSection from '@/app/components/Manual/sections/OverviewSection';

// Динамический импорт остальных секций
const LecturesSection = lazy(() => import('@/app/components/Manual/sections/LecturesSection'));
const TrainingSection = lazy(() => import('@/app/components/Manual/sections/TrainingSection'));
const EventsSection = lazy(() => import('@/app/components/Manual/sections/EventsSection'));
const ExamRulesSection = lazy(() => import('@/app/components/Manual/sections/ExamRulesSection'));
const ExamConductSection = lazy(() => import('@/app/components/Manual/sections/ExamConductSection'));
const InterviewConscriptSection = lazy(() => import('@/app/components/Manual/sections/InterviewConscriptSection'));
const InterviewContractSection = lazy(() => import('@/app/components/Manual/sections/InterviewContractSection'));
const InactiveScheduleSection = lazy(() => import('@/app/components/Manual/sections/InactiveScheduleSection'));
const WorkProceduresSection = lazy(() => import('@/app/components/Manual/sections/WorkProceduresSection'));
const AnnouncementsSection = lazy(() => import('@/app/components/Manual/sections/AnnouncementsSection'));
const ForumRulesSection = lazy(() => import('@/app/components/Manual/sections/ForumRulesSection'));
const ForumResponsesSection = lazy(() => import('@/app/components/Manual/sections/ForumResponsesSection'));

const sectionComponents: Record<string, React.ComponentType> = {
    overview: OverviewSection,
    lectures: LecturesSection,
    training: TrainingSection,
    events: EventsSection,
    'exam-rules': ExamRulesSection,
    'exam-conduct': ExamConductSection,
    'interview-conscript': InterviewConscriptSection,
    'interview-contract': InterviewContractSection,
    'inactive-schedule': InactiveScheduleSection,
    'work-procedures': WorkProceduresSection,
    announcements: AnnouncementsSection,
    'forum-rules': ForumRulesSection,
    'forum-responses': ForumResponsesSection,
};

export default function ManualPage() {
    const [activeSection, setActiveSection] = useState('overview');
    const SectionComponent = sectionComponents[activeSection];
    const currentSection = sections.find(section => section.id === activeSection);

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container">
                <Sidebar
                    navItems={navItems}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                <main className="main-content">
                    {currentSection && SectionComponent && (
                        <>
                            <h1 className="section-title">{currentSection.title}</h1>
                            <Suspense fallback={<div className="text-center py-10">Загрузка раздела...</div>}>
                                <SectionComponent />
                            </Suspense>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}