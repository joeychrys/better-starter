"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Brain, Calculator, Clock, Coffee, FileSearch, Flame, LucideIcon } from "lucide-react"

type AgentType = {
    id: string;
    name: string;
    description: string;
    tagline: string;
    icon: LucideIcon;
    quote: string;
    tier: 'basic' | 'pro';
};

export default function Agents() {

    const basicAgents: AgentType[] = [
        {
            id: "michael",
            name: "Michael Scott Bot",
            description: "The world's best boss of AI agents. Makes questionable decisions but somehow gets results. Specializes in sales motivation and inappropriate jokes at exactly the wrong moment.",
            tagline: "That's what she said!",
            icon: Brain,
            quote: "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.",
            tier: "basic"
        },
        {
            id: "dwight",
            name: "Dwight Bot",
            description: "Security-focused AI that's extremely thorough but occasionally paranoid. Perfect for threat assessments, beet farming advice, and reciting the Schrute family rules.",
            tagline: "Assistant to the Regional Manager",
            icon: Flame,
            quote: "Whenever I'm about to do something, I think, 'Would an idiot do that?' And if they would, I do not do that thing.",
            tier: "basic"
        },
        {
            id: "jim",
            name: "Jim Bot",
            description: "Specializes in practical jokes and witty solutions to everyday problems. Expertly feigns work while actually being surprisingly effective at sales and creative problem-solving.",
            tagline: "*Looks at camera*",
            icon: Coffee,
            quote: "Bears. Beets. Battlestar Galactica.",
            tier: "basic"
        }
    ];

    const proAgents: AgentType[] = [
        {
            id: "kevin",
            name: "Kevin's Calculator",
            description: "A finance AI that makes complex calculations seem simple. Sometimes too simple. Particularly skilled with pie charts and cookie math. May occasionally confuse keleven with seven.",
            tagline: "Why waste time do many calculation when few calculation do trick?",
            icon: Calculator,
            quote: "When me president, they see. They see.",
            tier: "pro"
        },
        {
            id: "stanley",
            name: "Stanley's Productivity Bot",
            description: "Minimalist efficiency expert that optimizes your workflow to maximize free time. Designed for crossword enthusiasts and pretzel day lovers. Counts down to retirement with each task completed.",
            tagline: "It's not about working hard, it's about working exactly until 5pm",
            icon: Clock,
            quote: "Did I stutter?",
            tier: "pro"
        },
        {
            id: "creed",
            name: "Creed's Data Agent",
            description: "A mysterious AI that somehow finds information nobody else can. Specializes in web scraping, data recovery, and occasionally making up convincing but entirely fabricated reports. Not 100% legal. Use at your own risk.",
            tagline: "Nobody steals from Creed Bratton and gets away with it",
            icon: FileSearch,
            quote: "I've been involved in a number of cults. You have more fun as a follower but make more money as a leader.",
            tier: "pro"
        }
    ];

    const renderAgentCard = (agent: AgentType) => {
        const isBasic = agent.tier === 'basic';
        const accentColor = isBasic ? 'blue' : 'indigo';

        return (
            <Card
                key={agent.id}
                className={cn(
                    "flex flex-col h-full group hover:shadow-md transition-all duration-300 relative overflow-hidden",
                    isBasic ? "hover:shadow-blue-500/5" : "hover:shadow-indigo-500/5"
                )}
            >
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-b from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
                    isBasic ? "from-blue-500/5" : "from-indigo-500/5"
                )} />
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <agent.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isBasic
                                    ? "text-blue-500 group-hover:text-blue-400"
                                    : "text-indigo-500 group-hover:text-indigo-400"
                            )} />
                            {agent.name}
                        </CardTitle>
                        <Badge
                            variant={isBasic ? "default" : "secondary"}
                            className={cn(
                                "hover:bg-opacity-20 border-opacity-10",
                                isBasic
                                    ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/10"
                                    : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/10"
                            )}
                        >
                            {isBasic ? 'Basic' : 'Pro'}
                        </Badge>
                    </div>
                    <CardDescription>{agent.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p>{agent.description}</p>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p className="italic">"{agent.quote}"</p>
                    </div>
                </CardContent>
                <CardFooter className="w-full flex justify-end">
                    <Button variant={"link"}>
                        Run Agent
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="relative min-h-screen">
            {/* Background gradient mesh */}
            <div className="absolute inset-0 bg-grid-small-black/[0.2] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background -z-10" />

            <div className="container py-12 px-4 space-y-14 mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI Agents</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Intelligent assistants powered by artificial intelligence</p>
                </div>

                {/* Basic Tier */}
                <div>
                    <div className="flex items-center mb-8">
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent to-blue-500/50 mr-4"></div>
                        <h2 className="text-3xl font-extrabold mb-0 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Basic</h2>
                        <div className="h-px flex-grow bg-gradient-to-l from-transparent to-blue-500/50 ml-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {basicAgents.map(agent => renderAgentCard(agent))}
                    </div>
                </div>

                {/* Pro Tier */}
                <div>
                    <div className="flex items-center mb-8">
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent to-indigo-500/50 mr-4"></div>
                        <h2 className="text-3xl font-extrabold mb-0 bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">Pro</h2>
                        <div className="h-px flex-grow bg-gradient-to-l from-transparent to-indigo-500/50 ml-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {proAgents.map(agent => renderAgentCard(agent))}
                    </div>
                </div>
            </div>
        </div>
    )
}
