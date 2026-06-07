"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TimelineItem {
  num: string;
  title: string;
  subtopic: string;
  desc: string;
}

export interface RoadmapDetails {
  title: string;
  emoji: string;
  roadmapType: "MONTHLY" | "DAILY";
  duration: number;
  durationLabel: string;
  timeline: TimelineItem[];
  recommendedCourse: string;
  checklist: string[];
}

export const ROADMAP_DATA: Record<string, RoadmapDetails> = {
  "Smart Study Assistant": {
    title: "Smart Study Assistant (एआई पढ़ाई साथी)",
    emoji: "📚",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Science Visual Learning (विज्ञान विज़ुअलाइज़र)", subtopic: "Visual Concepts", desc: "3D चित्रों और आसान चार्ट की मदद से विज्ञान को गहराई से समझना।" },
      { num: "Month 2", title: "Math Problem Solving (गणित समाधान)", subtopic: "Problem Solving", desc: "गणित के कठिन सवालों को हर कदम पर आसानी से हल करना सीखना।" },
      { num: "Month 3", title: "English & Communication (अंग्रेजी शिक्षा)", subtopic: "Grammar Practice", desc: "अंग्रेजी व्याकरण को सुधारना और बातचीत करना सीखना।" },
      { num: "Month 4", title: "Board Exam Preparation (परीक्षा की तैयारी)", subtopic: "Mock & Revision", desc: "परीक्षा के लिए जरूरी अभ्यास टेस्ट देना और महत्वपूर्ण नोट्स बनाना।" }
    ],
    recommendedCourse: "AI + School Studies + Future Skills - BharatOS Academy",
    checklist: [
      "Science tough topics visual models search",
      "Step-by-step Math calculations evaluate",
      "English essays vocabulary check run",
      "Mock test paper mock revisions practice"
    ]
  },
  "AI Expert": {
    title: "AI Expert (एआई एक्सपर्ट)",
    emoji: "🤖",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Scratch AI Blocks (स्क्रैच विजुअल कोडिंग)", subtopic: "Visual Coding", desc: "बिना कोडिंग लिखे आसान ब्लॉक्स की मदद से कंप्यूटर लॉजिक बनाना।" },
      { num: "Month 2", title: "Python Coding & Logic (पायथन प्रोग्रामिंग और लॉजिक)", subtopic: "Text Coding", desc: "पायथन भाषा में कोडिंग लिखकर कंप्यूटर प्रोग्राम बनाना सीखना।" },
      { num: "Month 3", title: "Simple Data Models (डेटा मॉडल्स और ट्रेनिंग)", subtopic: "Machine Learning", desc: "फोटो और शब्दों को पहचानने वाला एआई मॉडल ट्रेन करना।" },
      { num: "Month 4", title: "AI App Creation (एआई ऐप निर्माण)", subtopic: "Gen AI Basics", desc: "स्वयं का चैटबॉट और बात करने वाला एआई ऐप बनाना।" }
    ],
    recommendedCourse: "AI & Coding Foundations - BharatOS Academy",
    checklist: [
      "Scratch coding blocks ko connect karna",
      "Python standard syntax variables use karna",
      "Model training data collect aur categorize karna",
      "Prompt designs parameters setup karna"
    ]
  },
  "Website Developer": {
    title: "Website Developer (वेबसाइट बनाने वाला)",
    emoji: "🌐",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "HTML Structures (वेबसाइट का ढांचा)", subtopic: "Web Blueprint", desc: "हेडिंग, फोटो और बटन लगाकर वेबसाइट का पहला पन्ना बनाना।" },
      { num: "Month 2", title: "CSS Styles & design (वेबसाइट डिजाइन और स्टाइल)", subtopic: "Neon CSS", desc: "वेबसाइट को रंगीन और सुंदर डिजाइन देना सीखना।" },
      { num: "Month 3", title: "JavaScript Interaction (वेबसाइट में बटन और एक्शन)", subtopic: "Dynamic DOM", desc: "वेबसाइट में बटन दबाने पर काम करने वाले कैलकुलेटर जैसे फीचर्स जोड़ना।" },
      { num: "Month 4", title: "React Web App (मॉडर्न वेब एप्लीकेशन)", subtopic: "Deployment", desc: "वेबसाइट को इंटरनेट पर लाइव करके दुनिया को दिखाना।" }
    ],
    recommendedCourse: "Web Dev Essentials - BharatOS Academy",
    checklist: [
      "HTML forms structure design karna",
      "Cyber-dark CSS styling customize karna",
      "Interactive button actions verify karna",
      "Github and Vercel hosting setup karna"
    ]
  },
  "Game Developer": {
    title: "Game Developer (गेम बनाने वाला)",
    emoji: "🎮",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Scratch Games (स्क्रैच गेम मेकिंग)", subtopic: "Game Logic", desc: "आसान ब्लॉक जोड़कर चलने-दौड़ने वाले गेम बनाना सीखना।" },
      { num: "Month 2", title: "HTML Games (वेब ब्राउज़र गेम्स)", subtopic: "UI Elements", desc: "कंप्यूटर स्क्रीन पर दिखने वाले कंट्रोल और बटन बनाना।" },
      { num: "Month 3", title: "JavaScript Basics (जावास्क्रिप्ट गेम लॉजिक)", subtopic: "Physics Engine", desc: "गेम के किरदारों में कूदने, दौड़ने और टकराने के नियम डालना।" },
      { num: "Month 4", title: "AI Assisted Game Development (एआई और गेम डिज़ाइन)", subtopic: "Game AI Bots", desc: "गेम के दुश्मनों को खुद से दिमाग चलाना (एआई) सिखाना।" }
    ],
    recommendedCourse: "Game Coding & Logic Bootcamp - BharatOS Academy",
    checklist: [
      "Keyboard arrows movement configure karna",
      "Score aur Level increments system banana",
      "Jump and Gravity parameters design karna",
      "Game assets assets configure karna"
    ]
  },
  "App Developer": {
    title: "App Developer (मोबाइल ऐप बनाने वाला)",
    emoji: "📱",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Figma App UI (मोबाइल ऐप डिजाइन)", subtopic: "App Design", desc: "मोबाइल स्क्रीन पर ऐप कैसा दिखेगा, उसका सुंदर डिजाइन बनाना।" },
      { num: "Month 2", title: "App Building Blocks (ऐप लॉजिक और स्क्रीन्स)", subtopic: "Visual Layouts", desc: "बटन दबाने पर दूसरी स्क्रीन खुलने का लॉजिक जोड़ना।" },
      { num: "Month 3", title: "Database & Local Settings (डेटाबेस और लोकल सेटिंग्स)", subtopic: "App Storage", desc: "ऐप में यूजर का नाम, फोटो और सेटिंग्स सुरक्षित सेव करना।" },
      { num: "Month 4", title: "Publishing App APK (एंड्रॉइड ऐप पब्लिश करना)", subtopic: "Android Deploy", desc: "ऐप की फाइल बनाकर अपने फोन में इंस्टॉल करना।" }
    ],
    recommendedCourse: "Mobile App Development Course - BharatOS Academy",
    checklist: [
      "Mobile screen mockup layouts paint karna",
      "Multi-screen logic flow map karna",
      "Device data cache methods code karna",
      "APK format build execute karna"
    ]
  },
  "Computer Expert": {
    title: "Computer Expert (कंप्यूटर एक्सपर्ट)",
    emoji: "💻",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Computer Hardware & OS (कंप्यूटर के पार्ट्स और सिस्टम)", subtopic: "Core Hardware", desc: "कंप्यूटर के पुर्जों जैसे रैम, प्रोसेसर और विंडोज सेटिंग को समझना।" },
      { num: "Month 2", title: "Internet & Cloud Tools (इंटरनेट और ऑनलाइन कार्य)", subtopic: "Office Utilities", desc: "इंटरनेट का सही इस्तेमाल, ईमेल भेजना और ऑनलाइन फॉर्म भरना सीखना।" },
      { num: "Month 3", title: "Office Productivity (MS Office और डिजिटल कार्य)", subtopic: "Shell Scripts", desc: "वर्ड, एक्सेल और कमांड लाइन से कंप्यूटर पर तेजी से काम करना।" },
      { num: "Month 4", title: "Troubleshooting & Support (समस्या समाधान एवं सहायता)", subtopic: "Digital Safety", desc: "कंप्यूटर को वायरस से बचाना और खराबियों को ठीक करना।" }
    ],
    recommendedCourse: "Computer Core & Digital Literacy - BharatOS Academy",
    checklist: [
      "Desktop connections configure karna",
      "Excel math formulas test execution",
      "Command prompt commands practice run",
      "Chrome browser safety options secure"
    ]
  },
  "Digital Creator": {
    title: "Digital Creator (डिजिटल क्रिएटर)",
    emoji: "🎨",
    roadmapType: "MONTHLY",
    duration: 4,
    durationLabel: "महीने",
    timeline: [
      { num: "Month 1", title: "Design Fundamentals (डिजाइन के मूल सिद्धांत)", subtopic: "Aesthetics", desc: "सुंदर रंगों और फोंट्स को मिलाकर डिजाइन बनाना सीखना।" },
      { num: "Month 2", title: "Canva & Raster Tools (पोस्टर और बैनर मेकिंग)", subtopic: "Layering Graphics", desc: "स्कूल के बैनर, पोस्टर और सोशल मीडिया के लिए फोटो डिजाइन करना।" },
      { num: "Month 3", title: "Vector Art & Logos (लोगो डिजाइन और स्केचिंग)", subtopic: "Scalable Icons", desc: "दुकान या कंपनी के लिए लोगो और कंप्यूटर आर्ट बनाना।" },
      { num: "Month 4", title: "AI Design Prompting (एआई से आर्ट जेनरेशन)", subtopic: "AI Art Tools", desc: "एआई टूल में लिखकर अद्भुत कलाकृतियां और पेंटिंग्स बनाना।" }
    ],
    recommendedCourse: "Digital Creator & AI Art Specialist - BharatOS Academy",
    checklist: [
      "Contrast and color guidelines follow karna",
      "Flyer templates dimensions config karna",
      "SVG path coordinates define karna",
      "Prompt designs fine-tune setup karna"
    ]
  },
  "AI Masterclass": {
    title: "🔥 The Invisible Power House of AI",
    emoji: "⚡",
    roadmapType: "DAILY",
    duration: 7,
    durationLabel: "दिन",
    timeline: [
      { num: "Day 1", title: "एआई का जन्म और असली परिभाषा (The Silicon Genesis)", subtopic: "The Tokenizer Magic", desc: "Sovereign AI का कॉन्सेप्ट। लाइव देखना कि कैसे कोई भी वाक्य एआई के लिए शब्द नहीं, बल्कि नंबर्स और कोड्स में टूटता है।" },
      { num: "Day 2", title: "द सिलिकॉन बीस्ट (हार्डवेयर और ट्रांजिस्टर की भौतिकी)", subtopic: "The Matrix Multiplication Race", desc: "CPU बनाम GPU। Tensor Core एक नैनोसेकंड में लाखों मैट्रिक्स गुणा कैसे करता है।" },
      { num: "Day 3", title: "द इनविजिबल ग्रिड (बिजली, पानी और डेटा सेंटर्स)", subtopic: "Live Carbon & Power Calculator", desc: "एक सिंगल प्रॉम्प्ट की भौतिक कीमत। डेटा सेंटर्स की बिजली खपत और Liquid Cooling।" },
      { num: "Day 4", title: "इंटरनेट के कचरे से ज्ञान का जन्म (डेटा फिल्टरेशन)", subtopic: "The Clean vs Dirty Data Demo", desc: "Deduplication और टॉक्सिसिटी। रॉ इंटरनेट स्क्रैप और रिफाइंड डेटा में अंतर।" },
      { num: "Day 5", title: "शब्द जब स्पेस में तैरते हैं (वेक्टर्स और एम्बेडिंग्स)", subtopic: "The Vector Math Magic", desc: "मानवीय भाषा को शुद्ध गणितीय वेक्टर्स में बदलना। राजा - पुरुष + महिला = रानी।" },
      { num: "Day 6", title: "अटेंशन मैकेनिक्स (एआई कैसे ध्यान लगाता है?)", subtopic: "The Attention Map Visualization", desc: "Transformer Architecture और 'Self-Attention'। एआई किन शब्दों पर सबसे ज्यादा 'Attention Weight' देता है।" },
      { num: "Day 7", title: "द मास्टरमाइंड (MoE आर्किटेक्चर)", subtopic: "The Router Simulation", desc: "Mixture of Experts। Router/Gating Network का रोल। अलग-अलग Expert Layers कैसे एक्टिवेट होती हैं।" }
    ],
    recommendedCourse: "7-Day AI Masterclass - BharatOS Academy",
    checklist: [
      "Tokenizer conversion visualization run",
      "GPU Tensor Core matrix race demonstrate",
      "Data Center carbon power calculation check",
      "Deduplication minhash dirty data filter",
      "High-dimensional vector embedding math test",
      "Self-Attention weight mapping observe",
      "MoE Router gating network simulate"
    ]
  }
};

interface DemoContextType {
  name: string;
  setName: (name: string) => void;
  classCategory: string;
  setClassCategory: (cat: string) => void;
  selectedCareer: string;
  setSelectedCareer: (career: string) => void;
  roadmap: RoadmapDetails | null;
  completedTasks: string[];
  toggleTask: (task: string) => void;
  resetDemo: () => void;
  welcomeMessage: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string>("");
  const [classCategory, setClassCategoryState] = useState<string>("");
  const [selectedCareer, setSelectedCareerState] = useState<string>("");
  const [roadmap, setRoadmap] = useState<RoadmapDetails | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  // Load state from localStorage on init (safe for Next.js client)
  useEffect(() => {
    const savedName = localStorage.getItem("bharatos_name") || "";
    const savedClass = localStorage.getItem("bharatos_class") || "";
    const savedCareer = localStorage.getItem("bharatos_career") || "";
    const savedTasks = JSON.parse(localStorage.getItem("bharatos_tasks") || "[]");

    setNameState(savedName);
    setClassCategoryState(savedClass);
    if (savedCareer) {
      setSelectedCareerState(savedCareer);
      setRoadmap(ROADMAP_DATA[savedCareer] || null);
    }
    setCompletedTasks(savedTasks);
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem("bharatos_name", newName);
  };

  const setClassCategory = (newClass: string) => {
    setClassCategoryState(newClass);
    localStorage.setItem("bharatos_class", newClass);
  };

  const setSelectedCareer = (career: string) => {
    setSelectedCareerState(career);
    localStorage.setItem("bharatos_career", career);
    if (career && ROADMAP_DATA[career]) {
      setRoadmap(ROADMAP_DATA[career]);
      localStorage.setItem("bharatos_tasks", "[]");
      setCompletedTasks([]);
    } else {
      setRoadmap(null);
    }
  };

  const toggleTask = (task: string) => {
    const updated = completedTasks.includes(task)
      ? completedTasks.filter((t) => t !== task)
      : [...completedTasks, task];
    setCompletedTasks(updated);
    localStorage.setItem("bharatos_tasks", JSON.stringify(updated));
  };

  const resetDemo = () => {
    setNameState("");
    setClassCategoryState("");
    setSelectedCareerState("");
    setRoadmap(null);
    setCompletedTasks([]);
    setWelcomeMessage("");
    localStorage.removeItem("bharatos_name");
    localStorage.removeItem("bharatos_class");
    localStorage.removeItem("bharatos_career");
    localStorage.removeItem("bharatos_tasks");
  };

  return (
    <DemoContext.Provider
      value={{
        name,
        setName,
        classCategory,
        setClassCategory,
        selectedCareer,
        setSelectedCareer,
        roadmap,
        completedTasks,
        toggleTask,
        resetDemo,
        welcomeMessage
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};
