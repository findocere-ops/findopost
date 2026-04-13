import { EvaluationIssue, EvaluationScores } from './types';
import { BANNED_PHRASES } from './data/brand-config';

export function evaluateContent(text: string, isThread: boolean = false): EvaluationScores {
  const issues: EvaluationIssue[] = [];
  
  // 1. Check Voice Fit
  const hasFirstPerson = /\b(I'm|I've|I|my|me)\b/i.test(text);
  if (!hasFirstPerson && text.length > 0) {
    issues.push({
      rule: "No first-person language found. @findocere speaks from personal experience.",
      severity: "medium",
      rulePassed: false
    });
  }

  let voiceFitScore = hasFirstPerson ? 80 : 40;
  
  const guruPhrases = ["as an expert", "let me teach you", "i'll show you", "secret strategy", "trust me", "most people don't know"];
  let foundGuruPhrase = false;
  guruPhrases.forEach(phrase => {
    if (text.toLowerCase().includes(phrase)) {
        foundGuruPhrase = true;
        issues.push({
          rule: `Guru language detected: "${phrase}". @findocere is a practitioner, not a guru.`,
          severity: "high",
          rulePassed: false
        });
    }
  });

  if (!foundGuruPhrase) voiceFitScore += 20;

  // 2. Check Specificity
  const hasNumbers = /\d/.test(text);
  if (!hasNumbers && text.length > 0) {
    issues.push({
      rule: "No numbers found. Lead with data and real numbers.",
      severity: "low",
      rulePassed: false
    });
  }
  
  let specificityScore = hasNumbers ? 100 : 50;
  
  // 3. Hype Risk
  let hypeRiskScore = 0;
  let foundHypeWords = 0;
  BANNED_PHRASES.forEach(phrase => {
    if (text.toLowerCase().includes(phrase)) {
      foundHypeWords++;
      issues.push({
        rule: `Banned/Hype phrase detected: "${phrase}".`,
        severity: "high",
        rulePassed: false
      });
    }
  });
  
  hypeRiskScore = Math.min(100, foundHypeWords * 25);
  
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 1) {
    hypeRiskScore = Math.min(100, hypeRiskScore + 20);
    issues.push({
      rule: "Multiple exclamation marks detected. Keep tone analytical and calm.",
      severity: "medium",
      rulePassed: false
    });
  }

  // 4. Overclaim Risk
  let overclaimRiskScore = 0;
  const overclaimPhrases = ["guaranteed", "always", "risk-free", "never fails", "certain to"];
  
  overclaimPhrases.forEach(phrase => {
    if (text.toLowerCase().includes(phrase)) {
      overclaimRiskScore += 30;
      issues.push({
        rule: `Potential overclaim detected: "${phrase}". Disclose uncertainty honesty.`,
        severity: "high",
        rulePassed: false
      });
    }
  });

  // 5. Readability
  let readabilityScore = 100;
  const lines = text.split('\n');
  const longLines = lines.filter(l => l.trim().length > 180);
  
  if (longLines.length > 0) {
    readabilityScore -= 20;
    issues.push({
      rule: "Some lines are too long (>180 chars). Use shorter sentences and generous whitespace.",
      severity: "low",
      rulePassed: false
    });
  }
  
  // 6. Ending Strength
  let endingStrengthScore = 0;
  const endsWithQuestion = /\?[^"]*$/.test(text.trim());
  if (!endsWithQuestion && text.length > 0) {
     issues.push({
       rule: "Post does not end with a question. End with a question that forces an opinion.",
       severity: "medium",
       rulePassed: false
     });
  } else {
    endingStrengthScore = 50;
    
    // Check if it's a generic question
    const genericQuestions = ["thoughts?", "what do you think?", "agree?"];
    let isGeneric = false;
    genericQuestions.forEach(q => {
      if (text.toLowerCase().endsWith(q)) {
        isGeneric = true;
        issues.push({
          rule: `Generic question ending: "${q}". Use specific, opinion-forcing questions.`,
          severity: "medium",
          rulePassed: false
        });
      }
    });
    
    if (!isGeneric) {
      endingStrengthScore = 100;
    }
  }
  
  // 7. Brand Fit (links, emojis, tags)
  let brandFitScore = 100;
  
  const hasLink = /https?:\/\//.test(text);
  if (hasLink) {
    brandFitScore -= 40;
    issues.push({
      rule: "External link found in post body. Put links in the first reply.",
      severity: "high",
      rulePassed: false
    });
  }
  
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]/gu;
  const emojiCount = (text.match(emojiRegex) || []).length;
  if (emojiCount > 1) {
    brandFitScore -= 20;
    issues.push({
      rule: `${emojiCount} emojis found. Max 1 functional emoji per post.`,
      severity: "medium",
      rulePassed: false
    });
  }
  
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  if (hashtagCount > 1) {
    brandFitScore -= 20;
    issues.push({
      rule: `${hashtagCount} hashtags found. Max 1 per post, prefer zero.`,
      severity: "medium",
      rulePassed: false
    });
  }

  // Length calculations
  const characterCount = text.length;
  const isUnderLimit = isThread ? true : characterCount <= 280;
  
  if (!isUnderLimit) {
     issues.push({
       rule: `Post exceeds 280 characters (${characterCount}/280).`,
       severity: "high",
       rulePassed: false
     });
  }

  return {
    voiceFit: voiceFitScore,
    specificity: specificityScore,
    hypeRisk: hypeRiskScore,
    overclaimRisk: overclaimRiskScore,
    readability: readabilityScore,
    endingStrength: endingStrengthScore,
    brandFit: brandFitScore,
    characterCount,
    isUnderLimit,
    issues
  };
}
