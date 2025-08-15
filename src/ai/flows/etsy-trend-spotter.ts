'use server';
/**
 * @fileOverview Provides an AI-generated summary of trending keywords from Etsy product tags.
 *
 * - etsyTrendSpotter - A function that generates a summary of trending Etsy keywords.
 * - EtsyTrendSpotterInput - The input type for the etsyTrendSpotter function.
 * - EtsyTrendSpotterOutput - The return type for the etsyTrendSpotter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EtsyTrendSpotterInputSchema = z.object({
  tags: z.array(z.string()).describe('An array of product tags from Etsy listings.'),
});
export type EtsyTrendSpotterInput = z.infer<typeof EtsyTrendSpotterInputSchema>;

const EtsyTrendSpotterOutputSchema = z.object({
  summary: z.string().describe('A summary of trending keywords from the product tags.'),
});
export type EtsyTrendSpotterOutput = z.infer<typeof EtsyTrendSpotterOutputSchema>;

export async function etsyTrendSpotter(input: EtsyTrendSpotterInput): Promise<EtsyTrendSpotterOutput> {
  return etsyTrendSpotterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'etsyTrendSpotterPrompt',
  input: {schema: EtsyTrendSpotterInputSchema},
  output: {schema: EtsyTrendSpotterOutputSchema},
  prompt: `You are an expert in identifying trends on Etsy.
  Given the following list of product tags, generate a summary of the trending keywords and relevant opportunities for sellers:

  Tags: {{{tags}}}
  `,
});

const etsyTrendSpotterFlow = ai.defineFlow(
  {
    name: 'etsyTrendSpotterFlow',
    inputSchema: EtsyTrendSpotterInputSchema,
    outputSchema: EtsyTrendSpotterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
