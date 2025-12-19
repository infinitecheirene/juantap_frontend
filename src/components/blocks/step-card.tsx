interface StepCardProps {
    step: number
    title: string
    description: string
    gradient: string
}

export function StepCard({ step, title, description, gradient }: StepCardProps) {
    return (
        <div className="relative group">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center min-h-90 max-h-120 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                {/* Step number with gradient background */}
                <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${gradient} text-white font-bold text-xl mb-6 shadow-lg`}
                >
                    {step}
                </div>

                {/* Title with gradient text */}
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-purple-50 leading-relaxed">{description}</p>

                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-indigo-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-indigo-600/10 transition-all duration-300"></div>
            </div>
        </div>
    )
}