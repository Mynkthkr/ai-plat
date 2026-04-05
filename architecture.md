# AI Platform Architecture Flowchart

Below is the complete architectural flowchart for your AI News & Toolkit platform, covering the Next.js frontend, backend API routes, the background Cron job data pipeline, and external services.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#181825,stroke:#00f0ff,stroke-width:2px,color:#fff
    classDef api fill:#20202e,stroke:#b400ff,stroke-width:2px,color:#fff
    classDef external fill:#282838,stroke:#888,stroke-width:1px,color:#ddd,stroke-dasharray: 5 5
    classDef database fill:#15202b,stroke:#2bba5c,stroke-width:2px,color:#fff
    classDef cronjob fill:#3e3e4a,stroke:#ff5500,stroke-width:2px,color:#fff

    %% Subgraphs
    subgraph Client [📱 Next.js App Frontend]
        UI_Home[Homepage]:::frontend
        UI_Roast[Roast Tech Stack]:::frontend
        UI_Dog[Dog Explainer]:::frontend
        UI_Sub[Newsletter Subscribe]:::frontend
    end

    subgraph API [⚙️ Next.js API Routes]
        API_Articles["/api/articles"]:::api
        API_Roast["/api/roast-stack"]:::api
        API_Dog["/api/dog-explain"]:::api
        API_Sub["/api/subscribe"]:::api
        API_Cron["/api/cron/run"]:::api
    end

    subgraph Background_Workers [⏱ Background Jobs]
        Cron[Node-Cron Script]:::cronjob
        Pipeline[runFullPipeline Process]:::cronjob
    end

    subgraph Database [💾 Supabase PostgreSQL]
        DB_Articles[(Articles Table)]:::database
        DB_Subscribers[(Subscribers Table)]:::database
    end

    subgraph External [🌐 External Services]
        Gemini[Google Gemini 2.5 Flash]:::external
        Resend[Resend Email API]:::external
        RSS[Various RSS Feeds]:::external
    end

    %% Interactions - Application Frontend
    UI_Home -- "1. Fetch Fresh News" --> API_Articles
    UI_Roast -- "1. Submit Tech Stack" --> API_Roast
    UI_Dog -- "1. Submit Article Text" --> API_Dog
    UI_Sub -- "1. Submit Email" --> API_Sub

    %% Interactions - APIs
    API_Articles -- "2. Read Articles" --> DB_Articles
    API_Sub -- "2. Add/Reactivate Sub" --> DB_Subscribers
    
    API_Roast -- "2. Prompt Roast Persona" --> Gemini
    API_Dog -- "2. Generate Dog Response" --> Gemini

    API_Roast -- "3. Return Roast" --> UI_Roast
    API_Dog -- "3. Return Explanation" --> UI_Dog
    API_Articles -- "3. Display Feed" --> UI_Home

    %% Interactions - CRON Pipeline
    Cron -- "Triggers Every 6 Hours\n(HTTP POST Authorization: CRON_SECRET)" --> API_Cron
    API_Cron -- "Executes" --> Pipeline

    Pipeline -- "Step 1: Fetch External RSS" --> RSS
    Pipeline -- "Step 2: Rewrite Content" --> Gemini
    Pipeline -- "Step 3: Save Rewritten Intel" --> DB_Articles
    
    Pipeline -- "Step 4: Get Top Article" --> DB_Articles
    Pipeline -- "Step 5: Get Active Subs" --> DB_Subscribers
    Pipeline -- "Step 6: Send Daily Newsletter" --> Resend

```
