export interface FallbackParams {
  name: string;
  classCategory: string;
  career: string;
  isReturning?: boolean;
  visitDay?: number;
  completedTasksCount?: number;
}

export function getFallbackMessage(params: FallbackParams): string {
  const name = params.name || "Student";
  const classLabel = params.classCategory === "Class 6-8" 
    ? "कक्षा 6-8" 
    : params.classCategory === "Class 9-12" 
      ? "कक्षा 9-12" 
      : params.classCategory || "कक्षा 9-12";
  
  const careerRaw = params.career || "Game Developer";
  // Remove technical prefixes/suffixes if any
  const careerTitle = careerRaw.includes(" (") ? careerRaw.split(" (")[0] : careerRaw;
  const isStudyAssistant = careerRaw.includes("Smart Study Assistant");

  // 1. Smart Study Assistant Path
  if (isStudyAssistant) {
    if (params.isReturning) {
      const completedCount = params.completedTasksCount ?? 2;
      const visitDay = params.visitDay ?? 7;
      return `नमस्ते ${name}!

तुमने पिछली बार Smart Study Assistant चुना था।
तुमने ${completedCount} टॉपिक पूरे कर लिए हैं, जो कि बहुत बढ़िया है।
आज तुम्हारी पढ़ाई के सफर का दिन ${visitDay} है।
हम गणित, विज्ञान और अंग्रेजी में तुम्हारे डाउट्स क्लियर करने की राह पर हैं।

चलो आज का अगला कदम शुरू करते हैं।`;
    }

    return `नमस्ते!

मैं BharatOS AI Teacher हूँ।

मैं आपकी गणित, विज्ञान और अंग्रेजी की पढ़ाई में सहायता करने के लिए तैयार हूँ।
NCERT के कठिन अध्याय भी आसान भाषा में समझाने के लिए मार्गदर्शन उपलब्ध है।

आज हम Month 1 से शुरुआत करेंगे।

चलिए पहला कदम शुरू करते हैं।`;
  }

  // Helper variables for other careers
  const isRole = careerRaw.includes("AI Expert") || careerRaw.includes("Computer Expert") || careerRaw.includes("Digital Creator");

  // 2. Returning Student Path (Other Careers)
  if (params.isReturning) {
    const completedCount = params.completedTasksCount ?? 2;
    const visitDay = params.visitDay ?? 7;
    const dynamicSentence = isRole
      ? `तुम ${careerTitle} बनने की राह पर हो।`
      : `तुम अपना पहला ${careerTitle} प्रोजेक्ट बनाने की राह पर हो।`;

    return `नमस्ते ${name}!

तुमने पिछली बार ${careerTitle} चुना था।
तुमने ${completedCount} टॉपिक पूरे कर लिए हैं, जो कि बहुत बढ़िया है।
आज तुम्हारे सीखने के सफर का दिन ${visitDay} है।
${dynamicSentence}

चलो आज का अगला कदम शुरू करते हैं।`;
  }

  // 3. New Student Path (Other Careers)
  const dynamicSentence = isRole
    ? `अगर आप रोज 30 मिनट सीखते हैं तो 4 महीने में ${careerTitle} बन सकते हैं।`
    : `अगर आप रोज 30 मिनट सीखते हैं तो 4 महीने में अपना पहला ${careerTitle} प्रोजेक्ट बना सकते हैं।`;

  return `नमस्ते ${name}!

आप ${classLabel} में हैं और ${careerTitle} बनना चाहते हैं।
यह बहुत अच्छा लक्ष्य है।
${dynamicSentence}
आपके लिए एक व्यक्तिगत सीखने का मार्ग तैयार है।

चलो आज का पहला कदम शुरू करते हैं।`;
}
