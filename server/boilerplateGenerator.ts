import { invokeLLM } from "./_core/llm";

export interface BoilerplateGenerationRequest {
  niche: string;
  userId: number;
}

export interface BoilerplateGenerationResponse {
  niche: string;
  projectName: string;
  directoryStructure: string;
  files: Record<string, string>;
  description: string;
}

/**
 * Generates a complete Next.js boilerplate structure for a given business niche.
 * Uses LLM to create tailored components, pages, and configuration files.
 */
export async function generateBoilerplate(
  request: BoilerplateGenerationRequest
): Promise<BoilerplateGenerationResponse> {
  const { niche } = request;

  const systemPrompt = `You are an expert Next.js architect specializing in creating production-ready boilerplates for specific business niches.

Your task is to generate a complete, professional Next.js boilerplate tailored to the "${niche}" business niche.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON (no markdown, no code blocks, no explanations)
2. Generate realistic, production-grade code
3. Include all necessary files for a working Next.js application
4. Tailor all content specifically to the "${niche}" niche
5. Use TypeScript for all code files
6. Include proper error handling and best practices
7. Make the UI modern and professional

JSON STRUCTURE (MUST FOLLOW EXACTLY):
{
  "projectName": "string (kebab-case, niche-specific name)",
  "description": "string (2-3 sentences describing the boilerplate)",
  "directoryStructure": "string (ASCII tree showing file structure)",
  "files": {
    "path/to/file.ts": "full file content as string",
    "path/to/page.tsx": "full file content as string",
    ...
  }
}

REQUIRED FILES TO GENERATE:
- package.json (with all necessary dependencies)
- tsconfig.json
- next.config.js
- app/layout.tsx
- app/page.tsx
- app/globals.css
- lib/types.ts (domain models for the niche)
- lib/utils.ts (utility functions)
- components/Header.tsx
- components/Footer.tsx
- components/HeroSection.tsx
- components/FeatureCard.tsx
- public/favicon.ico (as base64 placeholder)

NICHE-SPECIFIC GUIDANCE FOR "${niche}":
- Create domain models relevant to this business type
- Design pages and components that solve real problems for this niche
- Include realistic example data and use cases
- Make the UI visually appealing with Tailwind CSS
- Include authentication scaffolding if relevant to the niche
- Add database schema suggestions in comments if applicable

Generate the boilerplate now. Return ONLY the JSON object, nothing else.`;

  const userPrompt = `Generate a complete Next.js boilerplate for a "${niche}" business. 
The boilerplate should be immediately deployable and include all necessary files.
Return ONLY valid JSON with no additional text or markdown.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error("No content received from LLM");
    }

    // Parse the JSON response
    let parsedResponse: {
      projectName: string;
      description: string;
      directoryStructure: string;
      files: Record<string, string>;
    };

    try {
      // Handle both string and array content from LLM
      let contentStr = typeof content === "string" ? content : "";
      
      if (Array.isArray(content)) {
        // If content is an array of content objects, extract text
        contentStr = content
          .filter((item) => item && typeof item === "object" && "text" in item)
          .map((item) => (item as { text: string }).text)
          .join("");
      }

      if (!contentStr) {
        throw new Error("Could not extract text from LLM response");
      }

      // Clean up the response in case it has markdown code blocks
      const cleanedContent = contentStr
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Failed to parse LLM response as JSON");
    }

    // Validate the response structure
    if (
      !parsedResponse.projectName ||
      !parsedResponse.files ||
      typeof parsedResponse.files !== "object"
    ) {
      throw new Error("Invalid boilerplate structure from LLM");
    }

    return {
      niche,
      projectName: parsedResponse.projectName,
      directoryStructure: parsedResponse.directoryStructure || generateDirectoryTree(parsedResponse.files),
      files: parsedResponse.files,
      description: parsedResponse.description || `Professional Next.js boilerplate for ${niche}`,
    };
  } catch (error) {
    console.error("Boilerplate generation error:", error);
    throw new Error(
      `Failed to generate boilerplate: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generates a simple ASCII directory tree from file paths
 */
function generateDirectoryTree(files: Record<string, string>): string {
  const paths = Object.keys(files).sort();
  const tree: string[] = [];

  paths.forEach((path, index) => {
    const depth = path.split("/").length - 1;
    const fileName = path.split("/").pop() || "";
    const isLast = index === paths.length - 1;

    let prefix = "";
    for (let i = 0; i < depth; i++) {
      prefix += "  ";
    }

    const connector = isLast ? "└── " : "├── ";
    tree.push(prefix + connector + fileName);
  });

  return "project-root/\n" + tree.join("\n");
}

/**
 * Compresses boilerplate files into a ZIP-like structure for download
 */
export function createBoilerplatePackage(boilerplate: BoilerplateGenerationResponse): string {
  const packageData = {
    metadata: {
      projectName: boilerplate.projectName,
      niche: boilerplate.niche,
      description: boilerplate.description,
      generatedAt: new Date().toISOString(),
    },
    files: boilerplate.files,
  };

  return JSON.stringify(packageData, null, 2);
}
