import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');

  // API URL - Production mein change karna
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://matrix360-backend.onrender.com/api'  // Tumhara backend URL
    : 'http://localhost:5000/api';  // Local development

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Error clear jab user type kare
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill all required fields (*)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Sending form data to:', `${API_URL}/contact`);
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          service: ''
        });
        
        // Success message for 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
        
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      
      // Fallback - agar backend offline hai toh console mein show kare
      if (err.message.includes('Failed to fetch')) {
        setError('Backend server is not responding. Using demo mode...');
        
        // Demo mode - simulate success after delay
        setTimeout(() => {
          setIsSubmitted(true);
          setFormData({
            name: '',
            email: '',
            company: '',
            message: '',
            service: ''
          });
          setIsLoading(false);
          
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        }, 1500);
      } else {
        setError('Network error. Please check your connection and try again.');
        setIsLoading(false);
      }
    } finally {
      if (!error.includes('demo mode')) {
        setIsLoading(false);
      }
    }
  };

  const services = [
    {
      id: 1,
      title: "AI Strategy Consulting",
      description: "Develop comprehensive AI roadmaps aligned with your business objectives. We analyze your current infrastructure and create a tailored strategy for AI adoption.",
      icon: "🚀"
    },
    {
      id: 2,
      title: "Machine Learning Solutions",
      description: "Custom ML models for predictive analytics, automation, and decision-making. We build, train, and deploy models that solve your specific business problems.",
      icon: "🤖"
    },
    {
      id: 3,
      title: "LLM & GPT Integration",
      description: "Implement and fine-tune large language models for chatbots, content generation, and intelligent automation tailored to your industry.",
      icon: "💬"
    },
    {
      id: 4,
      title: "AI Infrastructure",
      description: "Scalable cloud infrastructure setup and optimization for AI model deployment. We ensure reliability, security, and performance.",
      icon: "⚙️"
    },
    {
      id: 5,
      title: "Data Engineering",
      description: "Build robust data pipelines, warehouses, and lakes to fuel your AI/ML workflows with clean, structured data.",
      icon: "📊"
    },
    {
      id: 6,
      title: "AI Training & Support",
      description: "Comprehensive training programs and ongoing support to ensure your team can effectively use and maintain AI systems.",
      icon: "👨‍💻"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CTO, TechNova Inc.",
      text: "Matrix 360 transformed our business with their AI solutions. Our operational efficiency increased by 200% within 6 months. Their team's expertise is unparalleled.",
      initials: "SJ"
    },
    {
      id: 2,
      name: "Raj Patel",
      role: "CEO, InnovateCorp",
      text: "The AI strategy provided by Matrix 360 was exactly what we needed to stay ahead of competition. Their implementation was seamless and delivered immediate ROI.",
      initials: "RP"
    },
    {
      id: 3,
      name: "Maria Chen",
      role: "Director, Global Solutions",
      text: "Professional, timely, and revolutionary. Their team delivered beyond expectations and continues to provide exceptional support for our AI infrastructure.",
      initials: "MC"
    }
  ];

  const stats = [
    { number: "250+", label: "Projects Completed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "AI Experts" },
    { number: "24/7", label: "Support Available" }
  ];

  const features = [
    {
      icon: "🎯",
      title: "Tailored Solutions",
      description: "Custom AI strategies designed for your specific business challenges and industry requirements."
    },
    {
      icon: "⚡",
      title: "Fast Implementation",
      description: "Rapid deployment with minimal disruption to your existing operations and workflows."
    },
    {
      icon: "🔒",
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance to GDPR, HIPAA, and industry standards."
    },
    {
      icon: "🔄",
      title: "Continuous Support",
      description: "Ongoing maintenance, updates, and optimization of your AI systems for peak performance."
    }
  ];

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">Matrix <span className="logo-gradient">360</span> AI</span>
          </a>
          
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#testimonials" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Success Stories</a>
            <a href="#contact" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Business with
            <span className="hero-title-gradient">Artificial Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Matrix 360 AI provides cutting-edge AI consulting and development services to help 
            businesses leverage artificial intelligence for unprecedented growth, efficiency, 
            and competitive advantage.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              Start Your AI Journey
              <span>→</span>
            </a>
            <a href="#services" className="btn-secondary">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="ai-visual-container">
            <div className="central-ai">AI</div>
            <div className="orbital orb1"></div>
            <div className="orbital orb2"></div>
            <div className="orbital orb3"></div>
            <div className="connection-line"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2 className="section-title">Our AI Services</h2>
          <p className="section-subtitle">
            Comprehensive AI solutions tailored to accelerate your business transformation
            and drive measurable results.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href="#contact" className="service-link">Learn More →</a>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="about-title">Why Choose Matrix 360 AI?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="testimonials-title">Client Success Stories</h2>
        <p className="testimonials-subtitle">
          Hear from businesses that transformed with our AI solutions
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.initials}
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Ready to Transform Your Business with AI?</h2>
            <p className="contact-description">
              Schedule a free consultation with our AI experts. Let's discuss how we can 
              help you leverage artificial intelligence to achieve your business goals.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-icon">📧</div>
                <div className="contact-text">
                  <h4>Email Us</h4>
                  <p>contact@matrix360.ai</p>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon">📱</div>
                <div className="contact-text">
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon">📍</div>
                <div className="contact-text">
                  <h4>Visit Us</h4>
                  <p>Kolkata, India (Headquarters)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-container">
            <h3 className="contact-form-title">Start Your AI Journey Today</h3>
            
            {/* Success Message */}
            {isSubmitted && (
              <div className="success-message">
                <span>✓</span>
                Thank you! We'll contact you within 24 hours.
                {error.includes('demo mode') && (
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                    (Demo Mode - Backend would send real emails in production)
                  </div>
                )}
              </div>
            )}
            
            {/* Error Message */}
            {error && !isSubmitted && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Service Interest</option>
                  <option value="AI Strategy Consulting">AI Strategy Consulting</option>
                  <option value="Machine Learning Solutions">Machine Learning Solutions</option>
                  <option value="LLM & GPT Integration">LLM & GPT Integration</option>
                  <option value="AI Infrastructure">AI Infrastructure</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="AI Training & Support">AI Training & Support</option>
                </select>
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Tell us about your AI needs and business challenges... *"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Get Free Consultation
                    <span>→</span>
                  </>
                )}
              </button>
              
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '10px' }}>
                {API_URL.includes('localhost') ? 
                  'Running in local development mode' : 
                  'Connected to production backend'}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-logo-section">
              <a href="#home" className="logo">
                <span className="logo-icon">🧠</span>
                <span className="logo-text">Matrix <span className="logo-gradient">360</span> AI</span>
              </a>
              <p className="footer-tagline">
                Empowering businesses with cutting-edge artificial intelligence 
                solutions for sustainable growth and innovation.
            </p>
            </div>
            
            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">AI Strategy</a></li>
                <li><a href="#services">ML Solutions</a></li>
                <li><a href="#services">LLM Integration</a></li>
                <li><a href="#services">AI Infrastructure</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#testimonials">Case Studies</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#blog">AI Blog</a></li>
                <li><a href="#whitepapers">Whitepapers</a></li>
                <li><a href="#webinars">Webinars</a></li>
                <li><a href="#documentation">Docs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              © 2026 Matrix 360 AI Consulting. All rights reserved.
            </p>
            <p className="challenge-note">
              Built for Matrix 360 AI Developer Challenge | React Implementation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;