# SJSU CMPE 138 SPRING 2026 TEAM5
# File: logger.py
# Description: Logging facility for NBA Draft Scouting Database application
# Owner: Filho Tran
# All teammates import log_info, log_error, log_warning from this file

import logging
import os

# Create Log directory if it doesn't exist
os.makedirs("../Log", exist_ok=True)

logging.basicConfig(
    filename="../Log/app.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def log_info(msg):
    """Log an informational message e.g. successful operations"""
    logging.info(msg)

def log_error(msg):
    """Log an error message e.g. failed DB operations"""
    logging.error(msg)

def log_warning(msg):
    """Log a warning message e.g. unauthorized access attempts"""
    logging.warning(msg)
