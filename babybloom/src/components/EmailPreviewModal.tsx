import React from 'react';
import { format } from 'date-fns';
import { FiX, FiPaperclip } from 'react-icons/fi';
import logoImage from '../assets/bloom-baby-logo-v4.svg';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  emailAddress: string;
  reportPeriod: string;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  childName,
  emailAddress,
  reportPeriod
}) => {
  if (!isOpen) return null;

  const formattedDate = format(new Date(), 'MMMM d, yyyy');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Email Preview
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-5">
          {/* Email Preview */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">From:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">BabyBloom App &lt;no-reply@babybloom.app&gt;</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">To:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{emailAddress}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Subject:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200 font-medium">
                  {childName}'s Development PDF - {reportPeriod}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Date:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{formattedDate}</span>
              </div>
            </div>
            
            {/* Email Body */}
            <div className="p-6 bg-white dark:bg-gray-800">
              {/* Logo */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-2 overflow-visible">
                  <img src={logoImage} alt="BabyBloom Logo" className="w-full h-full" style={{ objectFit: 'contain' }} />
                </div>
                <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                  BabyBloom
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Capturing Your Child's Journey</div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                Hello,
              </p>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                Attached to this email is a PDF document containing {childName}'s development memories for {reportPeriod}.
              </p>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                This report includes:
              </p>
              
              <ul className="list-disc pl-5 mb-6 text-gray-800 dark:text-gray-200">
                <li className="mb-1">Developmental milestones</li>
                <li className="mb-1">Growth measurements</li>
                <li className="mb-1">Medical appointments</li>
                <li className="mb-1">References to captured memories</li>
              </ul>
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 flex items-center">
                <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-3 rounded text-blue-600 dark:text-blue-400 mr-4">
                  <FiPaperclip size={24} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {childName}_Development_{format(new Date(), 'yyyyMMdd')}.pdf
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2.4 MB - PDF Document
                  </div>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-6">
                You can view the PDF attachment using any PDF reader. If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>
              
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                Thank you for using BabyBloom to track your child's precious moments!
              </p>
              
              <p className="text-gray-800 dark:text-gray-200 mb-6">
                Warm regards,<br />
                The BabyBloom Team
              </p>
              
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="mb-2">
                  This email was sent to {emailAddress} because you requested a development report from the BabyBloom app.
                </p>
                <p>
                  2025 BabyBloom. All rights reserved.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="py-3 px-6 gradient-blue text-white rounded-lg font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;
