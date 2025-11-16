import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ExamsPage from "./pages/ExamsPage"; // Exams
import ExamRoundsPage from "./pages/ExamRoundsPage";
import ProgressPage from "./pages/ProgressPage";
import GradesPage from "./pages/GradesPage"; // Results
import ExamResultPage from "./pages/ExamResultPage";
import UsersPage from "./pages/UsersPage";
import SignUpPage from "./pages/SignUpPage";
import ReportsPage from "./pages/ReportsPage";
import StudentsPage from "./pages/StudentsPage";
import SettingsPage from "./pages/SettingsPage";

import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />

          {/* Exams */}
          <Route
            path="/exams"
            element={
              <Layout>
                <ExamsPage />
              </Layout>
            }
          />

          {/* Exam Rounds */}
          <Route
            path="/exam-rounds"
            element={
              <Layout>
                <ExamRoundsPage />
              </Layout>
            }
          />

          {/* Progress */}
          <Route
            path="/progress"
            element={
              <Layout>
                <ProgressPage />
              </Layout>
            }
          />

          {/* Results list */}
          <Route
            path="/results"
            element={
              <Layout>
                <GradesPage />
              </Layout>
            }
          />

          {/* Result detail */}
          <Route
            path="/results/:id"
            element={
              <Layout>
                <ExamResultPage />
              </Layout>
            }
          />

          {/* Students */}
          <Route
            path="/students"
            element={
              <Layout>
                <StudentsPage />
              </Layout>
            }
          />

          {/* Users */}
          <Route
            path="/users"
            element={
              <Layout>
                <UsersPage />
              </Layout>
            }
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={
              <Layout>
                <ReportsPage />
              </Layout>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}
