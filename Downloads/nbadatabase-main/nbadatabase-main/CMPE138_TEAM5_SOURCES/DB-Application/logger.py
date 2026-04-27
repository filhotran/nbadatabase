# appluication logger
# log_info, log_error, log_warning from this file

import logging, os

os.makedirs("../Log", exist_ok=True)

logging.basicConfig(
    filename="../Log/app.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def log_info(msg):  logging.info(msg)
def log_error(msg): logging.error(msg)
