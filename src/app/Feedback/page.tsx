"use client";
import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, Send, CheckCircle, AlertCircle, User, Mail } from 'lucide-react';

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: '',
    feedback: '',
    recommend: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '12ce0046-f532-4294-af0a-d8de702cb455',
          ...formData,
          from_name: formData.name,
          subject: `Feedback: ${formData.category} - ${formData.rating} stars`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          rating: 0,
          category: '',
          feedback: '',
          recommend: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your opinion matters to us. Help us improve by sharing your experience and suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Stats/Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Your Feedback Matters
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Helps us improve our services and products
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Guides our future development priorities
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Creates a better experience for everyone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                Anonymous Option
              </h3>
              <p className="text-purple-700 text-sm leading-relaxed">
                You can submit feedback anonymously by leaving the name and email fields empty. 
                We value all feedback, whether identified or anonymous.
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Tell Us About Your Experience
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">Thank you for your feedback! We appreciate your input.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">Failed to submit feedback. Please try again.</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Contact Info - Optional */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overall Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`p-1 rounded-full transition-colors ${
                          star <= formData.rating
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                    <span className="ml-4 text-sm text-gray-600">
                      {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate'}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a category</option>
                    <option value="Product/Service Quality">Product/Service Quality</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Website/App Experience">Website/App Experience</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="General Suggestion">General Suggestion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Would you recommend us to others? *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value="Yes"
                        checked={formData.recommend === 'Yes'}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value="No"
                        checked={formData.recommend === 'No'}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value="Maybe"
                        checked={formData.recommend === 'Maybe'}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Maybe</span>
                    </label>
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback *
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please share your detailed feedback, suggestions, or concerns..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0 || !formData.category || !formData.recommend}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Your feedback helps us improve. All submissions are reviewed and appreciated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;