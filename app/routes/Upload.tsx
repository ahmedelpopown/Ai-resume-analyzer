import { useState, type FormEvent } from "react"
import FileUploader from "~/components/FileUploader"
import Navbar from "~/components/Navbar"
import { usePuterStore } from "~/lib/Puter"
import { useNavigate } from "react-router"
import { convertPdfToImage } from "~/lib/Pdf2Img"
import { generateUUID } from "~/utils"
import { prepareInstructions } from "./constants"

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore()
    const navigate = useNavigate()
    const [isProcessing, setISProcessing] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const handelFileSelect = (file: File | null) => {
        setFile(file)
    }
    const handelAnalyzed = async ({ componyName, jobTitle, jobDescription, file }: { componyName: string, jobTitle: string, jobDescription: string, file: File }) => {

        setISProcessing(true)
        setStatusText('uploading the file...')
      
        const uploadedFile = await fs.upload([file])
        if (!uploadedFile) return setStatusText('Failed to upload:file is not uploaded')
        setStatusText('Converting to image...');

        const imageFile = await convertPdfToImage(file)
        if (!imageFile.file) return setStatusText('Failed to convert bdf to image')
        setStatusText('uploading image....')

        const uploadedImage = await fs.upload([imageFile.file])
        if (!uploadedImage) return setStatusText('Failed to upload:image is not uploaded')
        setStatusText('preparing the data...')

        const uuid=generateUUID();
        const data={
            id:uuid,
            resumePath:uploadedFile.path,
            imagePath:uploadedImage.path,
            componyName,
            jobTitle,
            jobDescription,
            feedback:''
        }
        await kv.set(`resume:${uuid}`,JSON.stringify(data))
        setStatusText('analyzing...');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription,})
        )
        if (!feedback) return setStatusText('Error:Failed to analyzed resume')    
        const feedbackText =  typeof feedback.message.content=== 'string'? feedback.message.content:feedback.message.content[0].text;;
    data.feedback=JSON.parse(feedbackText)
    await kv.set(`resume:${uuid}`,JSON.stringify(data))
    setStatusText('analyzing done');
    console.log(data)
    navigate(`/resume/${uuid}`)
    }
    const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);
        const componyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;
        if (!file) return
        handelAnalyzed({
            componyName,
            jobTitle,
            jobDescription,
            file
        })
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">

            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>smart feedback for your dream job</h1>
                    {
                        isProcessing ? (
                            <>
                                <h2>{statusText}</h2>
                                <img src="/images/resume-scan.gif" className="w-full" alt="" />
                            </>
                        ) : (<>
                            <h2>Drop Your resume for an ATS score and improvement tips</h2>
                        </>)
                    }
                    {
                        !isProcessing && (
                            <form id="upload-form" onSubmit={handelSubmit} className="flex flex-col gap-4 mt-8">
                                <div className="form-div">
                                    <label htmlFor="company-name" className="">Company Name</label>
                                    <input type="text" name="company-name" id="company-name" placeholder="Company Name" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title" className="">Job Title</label>
                                    <input type="text" name="job-title" id="job-title" placeholder="Job Title" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description" className="">Job Description</label>
                                    <textarea rows={5} name="job-description" id="job-description" placeholder="Job Description" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader" className="">Upload Resume</label>
                                    <FileUploader onFileSelect={handelFileSelect} />
                                    <button className="primary-button" type="submit" >Analyze Resume</button>
                                </div>

                            </form>
                        )
                    }
                </div>
            </section>
        </main>
    )
}

export default Upload
