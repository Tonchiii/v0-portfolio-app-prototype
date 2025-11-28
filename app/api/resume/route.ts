import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Try to find the resume image (check multiple locations and formats)
    const possiblePaths = [
      join(process.cwd(), "public", "elton-james-ramos-cv.png"),
      join(process.cwd(), "public", "resume", "elton-james-ramos-cv.png"),
      join(process.cwd(), "public", "elton-james-ramos-cv.jpg"),
      join(process.cwd(), "public", "resume", "elton-james-ramos-cv.jpg"),
    ]
    
    for (const resumePath of possiblePaths) {
      try {
        const imageBuffer = await readFile(resumePath)
        const isPng = resumePath.endsWith(".png")
        return new NextResponse(imageBuffer as unknown as BodyInit, {
          headers: {
            "Content-Type": isPng ? "image/png" : "image/jpeg",
            "Content-Disposition": `inline; filename="Elton_James_Ramos_Resume.${isPng ? "png" : "jpg"}"`,
          },
        })
      } catch {
        continue
      }
    }
    
    // If no file found in any location
    try {
      throw new Error("Resume not found")
    } catch (fileError) {
      // If file doesn't exist, return HTML with instructions
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume - Elton James T. Ramos</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: #e2e8f0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 2rem;
            }
            .container {
              background: rgba(30, 41, 59, 0.8);
              border: 1px solid rgba(6, 182, 212, 0.3);
              border-radius: 1rem;
              padding: 3rem;
              max-width: 600px;
              text-align: center;
              box-shadow: 0 0 40px rgba(6, 182, 212, 0.2);
            }
            .icon {
              width: 80px;
              height: 80px;
              margin: 0 auto 2rem;
              background: rgba(6, 182, 212, 0.1);
              border: 2px solid rgba(6, 182, 212, 0.3);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 2rem;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              background: linear-gradient(90deg, #06b6d4, #3b82f6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            p {
              color: #94a3b8;
              line-height: 1.8;
              margin-bottom: 1rem;
            }
            .code {
              background: rgba(6, 182, 212, 0.1);
              border: 1px solid rgba(6, 182, 212, 0.3);
              padding: 1rem;
              border-radius: 0.5rem;
              font-family: 'Courier New', monospace;
              font-size: 0.9rem;
              margin: 1.5rem 0;
              color: #22d3ee;
            }
            .contact {
              margin-top: 2rem;
              padding-top: 2rem;
              border-top: 1px solid rgba(6, 182, 212, 0.2);
            }
            .contact a {
              color: #22d3ee;
              text-decoration: none;
              transition: all 0.3s;
            }
            .contact a:hover {
              color: #06b6d4;
              text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📄</div>
            <h1>Resume Not Found</h1>
            <p>The resume file hasn't been uploaded yet.</p>
            <div class="code">
              Upload your resume image as:<br>
              <strong>elton-james-ramos-cv.jpg</strong><br>
              to: public/resume/
            </div>
            <div class="contact">
              <p><strong>Elton James T. Ramos</strong></p>
              <p>IT Student & Software Developer</p>
              <p>
                <a href="mailto:eltonramos417@gmail.com">eltonramos417@gmail.com</a><br>
                <a href="https://linkedin.com/in/elton-james-ramos" target="_blank">LinkedIn Profile</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 })
  }
}
