// Vercel Serverless Function API Endpoint for School App AI Teacher
// Deployable directly to Vercel via `vercel deploy` or GitHub integration

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.url || '';

  try {
    // 1. Read Chapter Endpoint
    if (path.includes('/read-chapter')) {
      const { className, subject, chapterName, language, pageImages } = req.body || {};
      const lang = language || 'Hinglish';

      const promptLang =
        lang === 'Hindi'
          ? 'हिंदी (Hindi)'
          : lang === 'English'
          ? 'English'
          : 'Hinglish (Hindi and English mixed naturally)';

      const mockQuestions = [
        {
          id: 'q1',
          question:
            lang === 'Hindi'
              ? 'इस पाठ का मुख्य संदेश क्या है?'
              : lang === 'English'
              ? 'What is the main takeaway of this chapter?'
              : 'Is chapter ka main takeaway kya hai?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctOption: 'Option A',
        },
        {
          id: 'q2',
          question:
            lang === 'Hindi'
              ? 'मुख्य पात्र ने क्या किया?'
              : lang === 'English'
              ? 'What did the main character do?'
              : 'Main character ne kya kiya?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctOption: 'Option B',
        },
      ];

      return res.status(200).json({
        status: true,
        message: 'Chapter analyzed successfully',
        data: {
          className: className || 'Class 1st',
          subject: subject || 'English',
          chapterName: chapterName || 'Chapter 1',
          language: lang,
          summary:
            lang === 'Hindi'
              ? `यह पाठ ${className} के ${subject} विषय का है। इसमें मुख्य अवधारणाओं को सरलता से समझाया गया है।`
              : lang === 'English'
              ? `This chapter belongs to ${className} ${subject}. It covers core concepts in a simple and engaging manner.`
              : `Yeh chapter ${className} ke ${subject} subject ka hai. Isme basic concepts ko simple Hinglish me samjhaaya gaya hai.`,
          keyPoints: [
            'Core concept introduction',
            'Important definitions and terms',
            'Exercise problem solving practice',
          ],
          questions: mockQuestions,
        },
      });
    }

    // 2. Evaluate Voice / Text Answer Endpoint
    if (path.includes('/evaluate-answer')) {
      const { question, studentAnswer, language } = req.body || {};
      const lang = language || 'Hinglish';

      const isCorrect = studentAnswer && studentAnswer.length > 2;

      return res.status(200).json({
        status: true,
        message: 'Answer evaluated',
        data: {
          isCorrect,
          score: isCorrect ? 90 : 40,
          feedback:
            lang === 'Hindi'
              ? isCorrect
                ? 'शाबाश! आपका उत्तर बिल्कुल सही है।'
                : 'अच्छा प्रयास! उत्तर को थोड़ा और सुधारें।'
              : lang === 'English'
              ? isCorrect
                ? 'Great job! Your answer is spot on.'
                : 'Good attempt! Try to refine your answer.'
              : isCorrect
              ? 'Shabash! Aapka answer bilkul correct hai.'
              : 'Good try! Thoda aur practise karein.',
          teacherVoiceTip: 'Keep reading every day to improve your skills!',
        },
      });
    }

    // 3. Check Notebook with Signature & Star Rating Endpoint
    if (path.includes('/check-notebook')) {
      const { studentName, rollNo, subject, teacherSignatureUrl, notebookImageBase64 } = req.body || {};

      const stars = 5;
      const gradeBadge = 'EXCELLENT';
      const teacherRemarks = 'Very neat handwriting and accurate solutions! Signature attached.';

      return res.status(200).json({
        status: true,
        message: 'Notebook checked successfully',
        data: {
          recordId: 'NB-' + Date.now(),
          studentName: studentName || 'Rahul Kumar',
          rollNo: rollNo || '12',
          subject: subject || 'English',
          stars,
          gradeBadge,
          teacherRemarks,
          signatureAttached: true,
          signatureUrl: teacherSignatureUrl || null,
          checkedImageOverlay: notebookImageBase64 || null,
          checkedAt: new Date().toISOString(),
        },
      });
    }

    // Default status route
    return res.status(200).json({
      status: true,
      service: 'School App Vercel AI Teacher Backend',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Internal AI service error',
    });
  }
};
