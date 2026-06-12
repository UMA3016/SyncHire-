const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get or Create Chat Room for an application
// @route   GET /api/chat/:applicationId
// @access  Private (Candidate/Recruiter)
const getChatRoom = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify Authorization: User must be either the candidate or the recruiter
    const isCandidate = req.user._id.toString() === application.candidateId.toString();
    const isRecruiter = req.user._id.toString() === job.recruiterId.toString();

    if (!isCandidate && !isRecruiter && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Find existing room
    let chatRoom = await ChatRoom.findOne({ applicationId });

    if (!chatRoom) {
      // Create new chat room
      chatRoom = await ChatRoom.create({
        applicationId,
        candidateId: application.candidateId,
        recruiterId: job.recruiterId,
        jobId: job._id,
      });
    }

    // Fetch messages
    const messages = await Message.find({ chatRoomId: chatRoom._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      chatRoom,
      messages,
      candidateId: application.candidateId,
      recruiterId: job.recruiterId,
      jobTitle: job.title,
      candidateName: application.name,
      companyName: job.company
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Upload file for chat
// @route   POST /api/chat/upload
// @access  Private
const uploadChatFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // File uploaded by multer in the routes file
    const fileUrl = `uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatRoom,
  uploadChatFile
};
