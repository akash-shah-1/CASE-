import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  BorderStyle,
  VerticalAlign,
  ShadingType,
  PageBreak,
  ImageRun,
  convertInchesToTwip
} from "docx";
import type { CaseStudyData, ImagePlaceholder } from "../src/types";

export async function generateDocx(data: CaseStudyData): Promise<Buffer> {
  // Helper to convert base64 to Uint8Array
  const base64ToUint8Array = (base64: string): Uint8Array => {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper to create image paragraph
  const createImageParagraph = (image: ImagePlaceholder): Paragraph => {
    if (!image.imageUrl || !image.imageUrl.startsWith('data:')) {
      return new Paragraph({
        children: [new TextRun({ text: `[Image: ${image.alt || image.id}]`, italics: true, color: "888888" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      });
    }

    try {
      const imageBytes = base64ToUint8Array(image.imageUrl);
      return new Paragraph({
        children: [
          new ImageRun({
            data: imageBytes,
            transformation: {
              width: 450,
              height: 250,
            },
            type: "png",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      });
    } catch (error) {
      console.error("Failed to process image:", error);
      return new Paragraph({
        children: [new TextRun({ text: `[Image: ${image.alt || image.id}]`, italics: true, color: "888888" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      });
    }
  };

  // Find image by ID
  const getImage = (id: string): ImagePlaceholder | undefined => 
    data.images?.find(img => img.id === id);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Title
          new Paragraph({
            text: data.title.toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),
          
          // Cover Image
          getImage('page1_cover') && createImageParagraph(getImage('page1_cover')!),
          
          // Introduction
          new Paragraph({
            children: [
              new TextRun({ text: "Introduction", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: data.introduction.text,
            spacing: { after: 200 },
          }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Country", bold: true })] }), new Paragraph(data.introduction.country)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Business", bold: true })] }), new Paragraph(data.introduction.businessType)],
                  }),
                ],
              }),
            ],
          }),

          // Business Goal - highlighted box
          new Paragraph({
            children: [
              new TextRun({ text: "Business Goal", bold: true, color: "FFFFFF" }),
            ],
            shading: { type: ShadingType.SOLID, color: "2563EB", fill: "2563EB" }, // Blue color to match theme
            spacing: { before: 400, after: 100 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: data.businessGoal,
            spacing: { after: 400 },
          }),

          // Problem (PAGE break here!)
          new Paragraph({
            children: [
              new PageBreak(),
              new TextRun({ text: "Problem / Project Challenge", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: data.problem.overview,
            spacing: { after: 200 },
          }),
          
          // Problem Images
          getImage('page2_problem1') && createImageParagraph(getImage('page2_problem1')!),
          getImage('page2_problem2') && createImageParagraph(getImage('page2_problem2')!),
          
          ...data.problem.points.map(p => new Paragraph({ text: `• ${p}`, spacing: { after: 100 } })),

          // CIS Approach
          new Paragraph({
            children: [
              new TextRun({ text: "CIS Approach (Discover, Solve, Simplify, Sustain)", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: data.approach.overview,
            spacing: { after: 200 },
          }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Discover", bold: true })] }), new Paragraph(data.approach.discover)] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Solve", bold: true })] }), new Paragraph(data.approach.solve)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Simplify", bold: true })] }), new Paragraph(data.approach.simplify)] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sustain", bold: true })] }), new Paragraph(data.approach.sustain)] }),
                ],
              }),
            ],
          }),

          // Solution (PAGE break here!)
          new Paragraph({
            children: [
              new PageBreak(),
              new TextRun({ text: "The Solution & Implementation", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({ text: data.solution.overview, spacing: { after: 200 } }),
          
          // Solution Images
          getImage('page3_solution1') && createImageParagraph(getImage('page3_solution1')!),
          getImage('page3_solution2') && createImageParagraph(getImage('page3_solution2')!),
          
          new Paragraph({ children: [new TextRun({ text: "This application is integrated with the following:", bold: true })] }),
          ...data.solution.points.map(p => new Paragraph({ text: `• ${p}`, spacing: { after: 100 } })),
          new Paragraph({ children: [new TextRun({ text: "Order channels supported:", bold: true })], spacing: { before: 200 } }),
          new Paragraph({ text: data.solution.modes.join(" | "), alignment: AlignmentType.CENTER }),

          // Technology Stack
          new Paragraph({
            children: [
              new TextRun({ text: "Technology Stack", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({ text: data.technologyStack.join(", ") }),

          // Benefits (PAGE break here!)
          new Paragraph({
            children: [
              new PageBreak(),
              new TextRun({ text: "Benefits & Strategic Outcomes", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          
          // Benefits Images
          getImage('page4_benefits') && createImageParagraph(getImage('page4_benefits')!),
          getImage('page4_results') && createImageParagraph(getImage('page4_results')!),
          
          ...data.benefits.map(b => new Paragraph({ text: `✓ ${b}`, spacing: { after: 100 } })),

          // Results
          new Paragraph({
            children: [
              new TextRun({ text: "Results Achieved", bold: true, size: 28 }),
            ],
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({ text: data.resultsAchieved }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
