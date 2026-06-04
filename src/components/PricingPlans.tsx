"use client";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

const plans = [
    {
        name: "NEET UG",
        subtitle: "Undergraduate Medical",
        price: "3,999",
        originalPrice: "6,999",
        popular: false,
        features: [
            "College Predictor (Unlimited)",
            "Cut-Off Analysis (All Rounds)",
            "Seat Matrix Access",
            "Choice Filling Assistant",
            "Email Support",
            "Basic Rank Predictor",
            "State Counselling Data",
            "Valid till Final Round",
        ],
        // Explicit layout tokens mapping to your CSS root variables
        badgeStyles: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
        checkStyles: "bg-[var(--color-primary)] text-white",
        buttonStyles: "bg-[var(--color-btn-outline-hover)] text-[var(--color-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-primary)] hover:text-white",
        cardBorderStyles: "border-[var(--color-border)] hover:border-[var(--color-primary)]/40",
        blobColor: "bg-[var(--color-primary)]",
    },
    {
        name: "NEET PG",
        subtitle: "Postgraduate Medical",
        price: "3,999",
        originalPrice: "6,999",
        popular: true,
        features: [
            "Everything in NEET UG",
            "DNB Counselling Support",
            "Priority Email Support",
            "Expert Counselling (2 Sessions)",
            "Advanced Analytics",
            "Seat Leaving Penalty Calculator",
            "Bond & Service Details",
            "Valid for 1 Year",
        ],
        badgeStyles: "bg-[var(--color-secondary-light)] text-[var(--color-secondary)]",
        checkStyles: "bg-[var(--color-secondary)] text-white",
        // Popular plan gets the solid, prominent filled primary button
        buttonStyles: "bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:-translate-y-0.5",
        cardBorderStyles: "border-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/5",
        blobColor: "bg-[var(--color-secondary)]",
    },
    {
        name: "INICET",
        subtitle: "INI-CET Counselling",
        price: "999",
        originalPrice: "1,999",
        popular: false,
        features: [
            "INI-CET College Predictor",
            "All India Institute Access",
            "Cut-Off Trends",
            "Seat Matrix",
            "Email Support",
            "Fee Structure Details",
            "Valid till Final Round",
        ],
        badgeStyles: "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
        checkStyles: "bg-[var(--color-accent)] text-white",
        buttonStyles: "bg-[var(--color-btn-outline-hover)] text-[var(--color-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-primary)] hover:text-white",
        cardBorderStyles: "border-[var(--color-border)] hover:border-[var(--color-primary)]/40",
        blobColor: "bg-[var(--color-accent)]",
    },
];

export function PricingPlans() {
    return (
        <section className="py-24 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
                        backgroundSize: "60px 60px",
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <SectionHeader
                        eyebrow="Pricing Plans"
                        title="Simple, Transparent Pricing"
                        description="Choose the plan that fits your NEET counselling needs. No hidden fees, cancel anytime."
                        align="center"
                        className="mb-14"
                    />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`relative flex flex-col ${plan.popular ? "lg:-mt-6 lg:mb-4" : ""}`}
                        >
                            <div
                                className={`relative flex flex-col h-full p-6 rounded-xl border bg-[var(--color-bg-secondary)] transition-all duration-300 overflow-hidden ${plan.cardBorderStyles}`}
                            >
                                {/* Floating Popular Pill */}
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold shadow-md whitespace-nowrap animate-pulse">
                                            <Sparkles className="w-3 h-3 text-white fill-white" />
                                            Popular
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2 mb-6">
                                    {/* Plan Category Badge */}
                                    <div className={`inline-flex px-3 py-1 rounded-full mb-3 font-medium text-xs ${plan.badgeStyles}`}>
                                        {plan.subtitle}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                                        {plan.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mt-3">
                                        <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                                            ₹{plan.price}
                                        </span>
                                        <span className="text-sm text-[var(--color-text-muted)] line-through">
                                            ₹{plan.originalPrice}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Starting from</p>
                                </div>

                                {/* Feature List Element */}
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${plan.checkStyles}`}>
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            <span className="text-sm text-[var(--color-text-secondary)] font-medium leading-normal">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Buttons */}
                                <button
                                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.buttonStyles}`}
                                >
                                    Get Started
                                </button>

                                {/* Aesthetic Background Blur Circles */}
                                <div className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none ${plan.blobColor}`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}