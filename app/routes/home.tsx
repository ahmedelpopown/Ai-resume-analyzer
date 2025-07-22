import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/Puter";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback! for your dream jom" },
  ];
}


export default function Home() {

  const { auth, kv } = usePuterStore();

  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/')
  }, [auth.isAuthenticated])
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true)
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))
      console.log('parsedResumes', parsedResumes)
      setResumes(parsedResumes || [])
      setLoadingResumes(false)
    }
    loadResumes()
  }, [])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications &  Resume Ratings</h1>
        {!loadingResumes && resumes?.length == 0 ? (
          <h2>No Resumes Found Upload Your First tesume to get FeedBack</h2>

        ) : (

          <h2>Review Your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
      </div>
    )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (

            <ResumeCard key={resume.id} resume={resume} />

          ))}
        </div>
      )}
      {!loadingResumes && resumes.length == 0 && (
        <div className="flex flex-col items-center  justify-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold "> Upload Resume</Link>
        </div>
      )}
    </section>

  </main>
}
