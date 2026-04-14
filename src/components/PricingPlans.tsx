"use client";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import AnimatedTitle from "./AnimatedTitle";

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
        color: "primary",
        lightColor: "primary-light",
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
        color: "secondary",
        lightColor: "secondary-light",
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
        color: "accent",
        lightColor: "accent-light",
    },
];

export function PricingPlans() {
    return (
        <section className="py-24 bg-gradient-to-b from-bg-secondary to-bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
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
                    <AnimatedTitle
                        text="Choose Your Success Package"
                        className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                    />
                    <p className="text-base text-foreground-muted">
                        Affordable plans with expert insights - No hidden charges, just
                        transparent pricing
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`relative ${plan.popular ? "lg:-mt-6 lg:mb-4" : ""}`}
                        >
                            <div
                                className={`relative h-full p-6 rounded-xl border flex flex-col transition-all duration-300 overflow-hidden ${plan.popular
                                        ? `border-${plan.color} bg-card shadow-xl shadow-${plan.color}/10`
                                        : "border-border bg-card hover:border-primary/30"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-0 pt-1 pb-4 right-3 z-20">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary-foreground text-xs font-semibold shadow-md whitespace-nowrap">
                                            <Sparkles className="w-3 h-3" />
                                            Popular
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4 mb-6">
                                    <div className={`inline-flex px-3 py-1 rounded-full bg-${plan.lightColor} mb-3`}>
                                        <span className={`text-xs font-medium text-${plan.color}`}>
                                            {plan.subtitle}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">
                                        {plan.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mt-3">
                                        <span className="text-3xl font-bold text-foreground">
                                            ₹{plan.price}
                                        </span>
                                        <span className="text-sm text-foreground-muted line-through">
                                            ₹{plan.originalPrice}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground-muted mt-1">Starting from</p>
                                </div>

                                <ul className="space-y-2.5 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5">
                                            <div className={`w-4 h-4 rounded-full bg-${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <Check className="w-2.5 h-2.5 text-${plan.color}-foreground" />
                                            </div>
                                            <span className="text-sm text-foreground-muted">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${plan.popular
                                            ? `bg-${plan.color} text-${plan.color}-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5`
                                            : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary-hover"
                                        }`}
                                >
                                    Get Started
                                </button>

                                <div className={`absolute -bottom-16 -right-16 w-48 h-48 bg-${plan.color} rounded-full opacity-5 blur-2xl pointer-events-none`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}