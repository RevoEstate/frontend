interface Testimonial {
    id: number;
    review: string;
    name: string;
    position: string;
    img: string;
    type: 'professional' | 'customer'; // Added type to distinguish
  }
  
  export const clientReviews: Testimonial[] = [
    {
      id: 1,
      review: "RevoEstate has transformed how we showcase properties. The 3D virtual tours have increased our engagement by 40%, and the price prediction feature helps us set competitive listings. Our properties sell faster now!",
      name: "Daniel Mekonnen",
      position: "Broker at Addis Realty",
      img: "/images/Testimonials/Testimonial2.jpg",
      type: 'professional'
    },
    {
      id: 2,
      review: "As a developer, RevoEstate's platform has been invaluable for marketing our new projects. The immersive property views give potential buyers confidence before they even visit in person. Our conversion rates have never been higher.",
      name: "Selamawit Abebe",
      position: "Sales Director at Harmony Developers",
      img: "/images/Testimonials/Testimonial6.jpg",
      type: 'professional'
    },
    {
      id: 3,
      review: "The analytics dashboard on RevoEstate helps us understand market trends better than any other platform. We've optimized our portfolio based on their price prediction models with excellent results.",
      name: "Yohannes Tesfaye",
      position: "Portfolio Manager at Capital Properties",
      img: "/images/Testimonials/Testimonial3.jpg",
      type: 'professional'
    },
    {
      id: 4,
      review: "I found my dream home through RevoEstate! The 3D tours saved me so much time - I could virtually explore dozens of properties without leaving my current home. The price estimates were spot on too!",
      name: "Amina Hassan",
      position: "Home Buyer",
      img: "/images/Testimonials/Testimonial7.jpg",
      type: 'customer'
    },
    {
      id: 5,
      review: "As an expat moving to Ethiopia, RevoEstate made the property search effortless. The detailed neighborhood insights and accurate price predictions helped me make an informed decision from abroad.",
      name: "Thomas Johnson",
      position: "Expatriate Investor",
      img: "/images/Testimonials/Testimonial8.jpg",
      type: 'customer'
    }
  ];