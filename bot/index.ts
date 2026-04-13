import { Telegraf, Markup, session, Context } from "telegraf";
import * as dotenv from "dotenv";
import { generateBotContent } from "./generation";
import { GenerationRequest, GenerationMode, Pillar, GenerationResult } from "../app/lib/types";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const whitelistedIdStr = process.env.WHITELISTED_USER_ID;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN missing");
if (!whitelistedIdStr) throw new Error("WHITELISTED_USER_ID missing");

const whitelistedId = parseInt(whitelistedIdStr, 10);

interface SessionData {
  lastNotes?: string;
  pillar: Pillar;
}

interface MyContext extends Context {
  session?: SessionData;
}

const bot = new Telegraf<MyContext>(token);

// Middleware to enforce whitelist
bot.use((ctx, next) => {
  if (ctx.from?.id === whitelistedId) {
    return next();
  }
  console.log(`Unauthorized access attempt from ${ctx.from?.id}`);
});

bot.use(session());

const setLocalSession = (ctx: MyContext) => {
  if (!ctx.session) ctx.session = { pillar: 'defi' };
  if (!ctx.session.pillar) ctx.session.pillar = 'defi';
}

bot.start((ctx) => {
  setLocalSession(ctx);
  ctx.reply(
    "👋 @findocere Content Studio Online.\n\n" +
    "Send me raw notes/thoughts, and I'll help construct a post.\n\n" +
    "Pillar is: DeFi (change with /pillar)."
  );
});

bot.command('pillar', (ctx) => {
  setLocalSession(ctx);
  ctx.reply("Select current content pillar:", Markup.inlineKeyboard([
    [Markup.button.callback("DeFi", "pillar_defi"), Markup.button.callback("Payments", "pillar_payments")],
    [Markup.button.callback("Agentic AI", "pillar_agentic_ai"), Markup.button.callback("Futarchy", "pillar_futarchy")]
  ]));
});

// Handle Pillar selections
bot.action(/pillar_(.+)/, (ctx) => {
  setLocalSession(ctx);
  const selectedPillar = ctx.match[1] as Pillar;
  if(ctx.session) ctx.session.pillar = selectedPillar;
  ctx.answerCbQuery();
  ctx.reply(`Pillar set to: ${selectedPillar.toUpperCase()}`);
});

bot.on("text", async (ctx) => {
  setLocalSession(ctx);
  // Ignore commands
  if (ctx.message.text.startsWith("/")) return;

  // Save the text as raw notes
  if (ctx.session) {
      ctx.session.lastNotes = ctx.message.text;
  }

  await ctx.reply(
    "📝 Notes received. What do you want to generate?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Single Post", "gen_single_post")],
      [Markup.button.callback("Thread (F3/F7)", "gen_thread")],
      [Markup.button.callback("Draft Rewrite", "gen_rewrite")]
    ])
  );
});

// Handle Generation Actions
bot.action(/gen_(.+)/, async (ctx) => {
  setLocalSession(ctx);
  const modeAction = ctx.match[1];
  
  // Transform gen action to internal generation mode
  const modeMap: Record<string, GenerationMode> = {
    'single_post': 'single_post',
    'thread': 'thread',
    'rewrite': 'rewrite'
  };
  
  const mode = modeMap[modeAction];
  if (!mode) return;

  const notes = ctx.session?.lastNotes;
  if (!notes) {
    ctx.answerCbQuery("No recent notes found. Send me some text first.");
    return;
  }

  ctx.answerCbQuery();
  const loadingMsg = await ctx.reply("✨ Consulting the skill graph and generating... Please wait.");

  const request: GenerationRequest = {
    mode,
    pillar: ctx.session?.pillar || 'defi',
    rawNotes: notes,
    topic: notes.substring(0, 100), // Infer topic from starting notes
    formulaId: 'auto',
    hookId: 'auto'
  };

  try {
    const result = await generateBotContent(request);
    
    // Send Final Post
    await ctx.reply(result.finalPost);

    // Build Evaluation Summary
    const scoreText = `
📊 **Evaluation Scores:**
Voice: ${result.evaluationScores.voiceFit}/100
Specificity: ${result.evaluationScores.specificity}/100
Ending Question: ${result.evaluationScores.endingStrength}/100
Hype Risk (Low better): ${result.evaluationScores.hypeRisk}/100

🧠 **Angle Chosen:** ${result.angle}
🎣 **Hook:** [${result.selectedHook?.id || '?'}] ${result.selectedHook?.rationale}
📝 **Rationale:** ${result.rationale}
    `.trim();

    await ctx.reply(scoreText, { parse_mode: 'Markdown' });

    if (result.replySuggestion) {
      await ctx.reply(`💡 **1st Reply Suggestion:**\n${result.replySuggestion}`, { parse_mode: 'Markdown' });
    }

    if (result.evaluationScores.issues.length > 0) {
      let issuesMsg = "⚠️ **Issues detected by heuristic rules:**\n";
      result.evaluationScores.issues.forEach(iss => {
        const icon = iss.severity === 'high' ? '🔴' : iss.severity === 'medium' ? '🟡' : '⚪';
        issuesMsg += `${icon} ${iss.rule}\n`;
      });
      await ctx.reply(issuesMsg, { parse_mode: 'Markdown' });
    }

  } catch (error: any) {
    await ctx.reply(`❌ Generation Error: ${error.message}`);
  } finally {
    // Cleanup loading text
    try {
       await ctx.telegram.deleteMessage(ctx.chat?.id as number, loadingMsg.message_id);
    } catch(e) {}
  }
});

// Start bot
bot.launch(() => {
  console.log("Bot running. Send commands to your configured Telegram bot.");
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
