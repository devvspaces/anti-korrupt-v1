/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import { ModuleSchema, ModuleData } from './module-schema';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seedModule(moduleData: ModuleData) {
  console.log(
    `\nSeeding module: ${moduleData.title} (order: ${moduleData.order})`,
  );

  // Check if module already exists
  const existing = await db
    .select()
    .from(schema.modules)
    .where(eq(schema.modules.order, moduleData.order))
    .limit(1);

  if (existing.length > 0) {
    console.log(
      `  ⚠️  Module with order ${moduleData.order} already exists. Skipping.`,
    );
    return { skipped: true };
  }

  try {
    // Insert module
    const [module] = await db
      .insert(schema.modules)
      .values({
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        characterVideoUrl: moduleData.characterVideoUrl,
        overview: moduleData.overview,
        objectives: moduleData.objectives || [],
      })
      .returning();

    console.log(`  ✅ Created module: ${module.title}`);

    let resourceOrder = 1;

    // Seed Videos
    if (moduleData.resources.videos && moduleData.resources.videos.length > 0) {
      for (const video of moduleData.resources.videos) {
        const [resource] = await db
          .insert(schema.resources)
          .values({
            moduleId: module.id,
            type: 'video',
            title: video.title,
            order: resourceOrder++,
          })
          .returning();

        await db.insert(schema.videos).values({
          resourceId: resource.id,
          videoUrl: video.videoUrl,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          subtitles: video.subtitles || [],
        });

        // Index subtitles for search
        if (video.subtitles) {
          for (const subtitle of video.subtitles) {
            await db.insert(schema.searchableContent).values({
              moduleId: module.id,
              resourceId: resource.id,
              contentType: 'video_subtitle',
              contentText: subtitle.text,
              timestamp: subtitle.start,
            });
          }
        }

        console.log(`    ✅ Added video: ${video.title}`);
      }
    }

    // Seed Quiz
    if (moduleData.resources.quiz) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'quiz',
          title: 'Module Quiz',
          order: resourceOrder++,
        })
        .returning();

      const [quiz] = await db
        .insert(schema.quizzes)
        .values({
          resourceId: resource.id,
          passingScore: moduleData.resources.quiz.passingScore,
          questionsPerAttempt: moduleData.resources.quiz.questionsPerAttempt,
        })
        .returning();

      for (const question of moduleData.resources.quiz.questions) {
        await db.insert(schema.quizQuestions).values({
          quizId: quiz.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          hint: question.hint,
          correctExplanation: question.correctExplanation,
          incorrectExplanation: question.incorrectExplanation,
        });
      }

      console.log(
        `    ✅ Added quiz with ${moduleData.resources.quiz.questions.length} questions`,
      );
    }

    // Seed Flashcards
    if (
      moduleData.resources.flashcards &&
      moduleData.resources.flashcards.length > 0
    ) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'flashcard',
          title: 'Flashcards',
          order: resourceOrder++,
        })
        .returning();

      for (let i = 0; i < moduleData.resources.flashcards.length; i++) {
        const flashcard = moduleData.resources.flashcards[i];
        await db.insert(schema.flashcards).values({
          resourceId: resource.id,
          question: flashcard.question,
          answer: flashcard.answer,
          order: i + 1,
        });
      }

      console.log(
        `    ✅ Added ${moduleData.resources.flashcards.length} flashcards`,
      );
    }

    // Seed Slides
    if (moduleData.resources.slides) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'slides',
          title: 'Presentation Slides',
          order: resourceOrder++,
        })
        .returning();

      await db.insert(schema.slides).values({
        resourceId: resource.id,
        pdfUrl: moduleData.resources.slides.pdfUrl,
        pageCount: moduleData.resources.slides.pageCount,
      });

      console.log(`    ✅ Added slides`);
    }

    // Seed Infographics
    if (
      moduleData.resources.infographics &&
      moduleData.resources.infographics.length > 0
    ) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'infographics',
          title: 'Infographics',
          order: resourceOrder++,
        })
        .returning();

      for (let i = 0; i < moduleData.resources.infographics.length; i++) {
        const infographic = moduleData.resources.infographics[i];
        await db.insert(schema.infographics).values({
          resourceId: resource.id,
          imageUrl: infographic.imageUrl,
          thumbnailUrl: infographic.thumbnailUrl,
          order: i + 1,
        });
      }

      console.log(
        `    ✅ Added ${moduleData.resources.infographics.length} infographics`,
      );
    }

    // Seed Reports
    if (
      moduleData.resources.reports &&
      moduleData.resources.reports.length > 0
    ) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'report',
          title: 'Reports',
          order: resourceOrder++,
        })
        .returning();

      for (let i = 0; i < moduleData.resources.reports.length; i++) {
        const report = moduleData.resources.reports[i];
        await db.insert(schema.reports).values({
          resourceId: resource.id,
          content: report.content,
          order: i + 1,
        });

        // Index report content for search
        await db.insert(schema.searchableContent).values({
          moduleId: module.id,
          resourceId: resource.id,
          contentType: 'report',
          contentText: report.content,
        });
      }

      console.log(
        `    ✅ Added ${moduleData.resources.reports.length} reports`,
      );
    }

    // Seed Audio
    if (moduleData.resources.audio && moduleData.resources.audio.length > 0) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'audio',
          title: 'Audio Resources',
          order: resourceOrder++,
        })
        .returning();

      for (let i = 0; i < moduleData.resources.audio.length; i++) {
        const audio = moduleData.resources.audio[i];
        await db.insert(schema.audioFiles).values({
          resourceId: resource.id,
          audioUrl: audio.audioUrl,
          duration: audio.duration,
          subtitles: audio.subtitles || [],
          order: i + 1,
        });

        // Index audio subtitles for search
        if (audio.subtitles) {
          for (const subtitle of audio.subtitles) {
            await db.insert(schema.searchableContent).values({
              moduleId: module.id,
              resourceId: resource.id,
              contentType: 'audio_subtitle',
              contentText: subtitle.text,
              timestamp: subtitle.start,
            });
          }
        }
      }

      console.log(
        `    ✅ Added ${moduleData.resources.audio.length} audio files`,
      );
    }

    // Seed Game
    if (moduleData.resources.game) {
      const [resource] = await db
        .insert(schema.resources)
        .values({
          moduleId: module.id,
          type: 'game',
          title: 'Crossword Puzzle',
          order: resourceOrder++,
        })
        .returning();

      await db.insert(schema.games).values({
        resourceId: resource.id,
        gridSize: moduleData.resources.game.gridSize,
        clues: moduleData.resources.game.clues,
      });

      console.log(`    ✅ Added crossword game`);
    }

    return { skipped: false, module };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Error seeding module: ${errorMessage}`);
    throw error;
  }
}

async function main() {
  console.log('🌱 Starting module seeding...\n');

  const modulesDir = path.join(process.cwd(), 'modules');

  if (!fs.existsSync(modulesDir)) {
    console.error(`❌ Modules directory not found: ${modulesDir}`);
    console.log('Please create a "modules" directory and add JSON files.');
    process.exit(1);
  }

  const files = fs
    .readdirSync(modulesDir)
    .filter((file) => file.endsWith('.json'));

  if (files.length === 0) {
    console.log('⚠️  No JSON files found in modules directory.');
    process.exit(0);
  }

  console.log(`Found ${files.length} module file(s)\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = path.join(modulesDir, file);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // Validate with Zod
      const moduleData = ModuleSchema.parse(jsonData);

      const result = await seedModule(moduleData);

      if (result.skipped) {
        skipped++;
      } else {
        inserted++;
      }
    } catch (error) {
      errors++;
      console.error(`\n❌ Error processing ${file}:`);
      if (error.name === 'ZodError') {
        console.error(
          'Validation errors:',
          JSON.stringify(error.errors, null, 2),
        );
      } else {
        console.error(error.message);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Seeding Summary:');
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ⚠️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(50));

  await client.end();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
