"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Manual/Header"
import Sidebar from "@/app/components/Manual/Sidebar"
import { navItems } from "@/data/manualData"
import OverviewSection from "@/app/components/Manual/sections/default/OverviewSection"
import { useAuth } from "@/lib/auth/auth-context"
import { AlertCircle } from "lucide-react"

const LecturesSection = lazy(() => import("@/app/components/Manual/sections/default/LecturesSection"))
const TrainingSection = lazy(() => import("@/app/components/Manual/sections/default/TrainingSection"))
const EventsSection = lazy(() => import("@/app/components/Manual/sections/default/EventsSection"))
const ExamSection = lazy(() => import("@/app/components/Manual/sections/default/ExamSection"))
const AmmunitionSupplies = lazy(() => import("@/app/components/Manual/sections/default/AmmunitionSupplies"))
const InterviewConscriptSection = lazy(() => import("@/app/components/Manual/sections/default/InterviewConscriptSection"),)
const InterviewContractSection = lazy(() => import("@/app/components/Manual/sections/default/InterviewContractSection"))
const RPTaskSection = lazy(() => import("@/app/components/Manual/sections/default/RPTaskSection"))
import MinistryOfDefense from "@/app/components/Manual/sections/default/MinistryOfDefense"
const AnnouncementsSection = lazy(() => import("@/app/components/Manual/sections/ss/AnnouncementsSection"))
const ForumResponsesSection = lazy(() => import("@/app/components/Manual/sections/ss/ForumResponsesSection"))
const GossWaveSection = lazy(() => import("@/app/components/Manual/sections/ss/GossWaveSection"))
const ReportGenerator = lazy(() => import("@/app/components/Manual/sections/ss/ReportGenerator"))
const UserManagementSection = lazy(() => import("@/app/components/Manual/sections/admin/UserManagementSection"))
const ActionLogSection = lazy(() => import("@/app/components/Manual/sections/admin/ActionLogSection"))
const ParkingSpaces = lazy(() => import("@/app/components/Manual/sections/default/ParkingSpaces"))

const sectionComponents: Record<string, React.ComponentType> = {
  overview: OverviewSection,
  lectures: LecturesSection,
  training: TrainingSection,
  events: EventsSection,
  "exam-section": ExamSection,
  "ammunition-supplies": AmmunitionSupplies,
  "interview-conscript": InterviewConscriptSection,
  "interview-contract": InterviewContractSection,
  "rp-task": RPTaskSection,
  "ministry-of-defense": MinistryOfDefense,
  announcements: AnnouncementsSection,
  "forum-responses": ForumResponsesSection,
  "goss-wave": GossWaveSection,
  "report-generator": ReportGenerator,
  "user-management": UserManagementSection,
  "action-log": ActionLogSection,
  "parking-spaces": ParkingSpaces,
}

const getSectionTitle = (id: string) => {
  const item = navItems.find((item) => item.id === id)
  return item ? item.title : "Раздел"
}

export default function ManualPage() {
  const router = useRouter()
  const { canAccessSection, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const SectionComponent = sectionComponents[activeSection]

  useEffect(() => {
    document.body.classList.add("manual-page")
    return () => {
      document.body.classList.remove("manual-page")
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !canAccessSection(activeSection)) {
      setActiveSection("overview")
    }
  }, [activeSection, canAccessSection, isLoading])

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-300">Загрузка...</div>
        </div>
    )
  }

  return (
      <div className="min-h-screen">
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <Sidebar navItems={navItems} activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className="bg-[#1a4d2e]/20 backdrop-blur-sm rounded-lg border border-[#2d6a4f]/50 p-8 shadow-2xl text-white">
              {!canAccessSection(activeSection) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Доступ ограничен</h2>
                    <p className="text-slate-300 mb-6">У вас нет прав для просмотра этого раздела</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Войти в систему
                    </button>
                  </div>
              ) : SectionComponent ? (
                  <>
                    <h1 className="text-3xl font-bold text-[#4ade80] border-b-2 border-[#4ade80]/50 pb-4 mb-6">
                      {getSectionTitle(activeSection)}
                    </h1>
                    <Suspense
                        fallback={
                          <div className="flex items-center justify-center py-20">
                            <div className="text-slate-300">Загрузка раздела...</div>
                          </div>
                        }
                    >
                      <SectionComponent />
                    </Suspense>
                  </>
              ) : null}
            </main>
          </div>
        </div>
      </div>
  )
}
