import jsPDF from 'jspdf';
import type { Question, Evaluation } from '@/types/interview';

export async function generateInterviewPDF(
  questions: Question[],
  userAnswers: Map<string, string>,
  evaluations: Map<string, Evaluation>
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: number[] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.5;

    lines.forEach((line: string) => {
      addNewPageIfNeeded(lineHeight);
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Title
  addText('Mock Interview Report', 24, 'bold', [37, 99, 235]);
  yPosition += 5;

  // Date
  addText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10);
  yPosition += 10;

  // Summary
  const answeredCount = Array.from(userAnswers.values()).filter(a => a.length >= 10).length;
  const evaluatedCount = evaluations.size;

  pdf.setDrawColor(200, 200, 200);
  pdf.rect(margin, yPosition, maxWidth, 20);
  yPosition += 7;
  addText(`Questions: ${questions.length} | Answered: ${answeredCount} | Evaluated: ${evaluatedCount}`, 11, 'bold');
  yPosition += 10;

  // Questions
  questions.forEach((q, index) => {
    addNewPageIfNeeded(30);

    // Question number
    yPosition += 5;
    pdf.setFillColor(239, 246, 255);
    pdf.rect(margin, yPosition - 5, maxWidth, 10, 'F');
    addText(`Question ${index + 1}`, 14, 'bold', [30, 64, 175]);
    yPosition += 3;

    // Category and difficulty badges
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${q.category.toUpperCase()} | ${q.difficulty.toUpperCase()}`, margin, yPosition);
    yPosition += 7;

    // Question text
    addText(q.question, 11, 'bold');
    yPosition += 5;

    // User's answer
    const userAnswer = userAnswers.get(q.id);
    if (userAnswer) {
      addNewPageIfNeeded(20);
      addText('Your Answer:', 10, 'bold', [22, 163, 74]);
      yPosition += 2;
      addText(userAnswer, 9, 'normal', [60, 60, 60]);
      yPosition += 5;
    }

    // Evaluation
    const evaluation = evaluations.get(q.id);
    if (evaluation) {
      addNewPageIfNeeded(30);

      // Score
      const scoreColor = evaluation.score >= 75 ? [22, 163, 74] : evaluation.score >= 60 ? [234, 179, 8] : [220, 38, 38];
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.text(`Score: ${evaluation.score}/100`, margin, yPosition);
      yPosition += 7;

      // Detailed feedback
      pdf.setTextColor(0, 0, 0);
      addText('Feedback:', 10, 'bold');
      yPosition += 1;
      addText(evaluation.detailedFeedback, 9);
      yPosition += 3;

      // Strengths
      if (evaluation.strengths.length > 0) {
        addText('Strengths:', 10, 'bold', [22, 163, 74]);
        yPosition += 1;
        evaluation.strengths.forEach(strength => {
          addText(`• ${strength}`, 9, 'normal', [60, 60, 60]);
          yPosition += 1;
        });
        yPosition += 2;
      }

      // Areas for improvement
      if (evaluation.areasForImprovement.length > 0) {
        addText('Areas for Improvement:', 10, 'bold', [234, 88, 12]);
        yPosition += 1;
        evaluation.areasForImprovement.forEach(area => {
          addText(`• ${area}`, 9, 'normal', [60, 60, 60]);
          yPosition += 1;
        });
        yPosition += 2;
      }

      // Suggestions
      if (evaluation.suggestions.length > 0) {
        addText('Suggestions:', 10, 'bold', [37, 99, 235]);
        yPosition += 1;
        evaluation.suggestions.forEach(suggestion => {
          addText(`• ${suggestion}`, 9, 'normal', [60, 60, 60]);
          yPosition += 1;
        });
        yPosition += 2;
      }

      yPosition += 3;
    }

    // Model answer
    addNewPageIfNeeded(20);
    addText('Model Answer:', 10, 'bold', [22, 163, 74]);
    yPosition += 2;
    addText(q.modelAnswer, 9, 'normal', [60, 60, 60]);
    yPosition += 10;

    // Separator
    if (index < questions.length - 1) {
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    }
  });

  // Footer on last page
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    'Generated with Mock Interview Prep - AI-powered interview practice',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Save PDF
  const filename = `mock-interview-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
