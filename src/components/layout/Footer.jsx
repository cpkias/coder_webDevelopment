/**
 * Footer Component
 * Site footer with links and information
 */

import { Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm text-gray-400">
              Your campus event management platform. Discover, organize, and participate in amazing college events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-sm hover:text-primary-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-sm hover:text-primary-400 transition-colors">
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Organizers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-sm hover:text-primary-400 transition-colors">
                  Become an Organizer
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="text-sm hover:text-primary-400 transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="text-sm hover:text-primary-400 transition-colors">
                  Manage Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-primary-400" />
                <span className="text-sm">support@eventhub.edu</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-primary-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-primary-400" />
                <span className="text-sm">123 Campus Drive, University City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
