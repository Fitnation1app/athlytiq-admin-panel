FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app

# Environment variables
ENV PYTHONPATH=/app \
    PORT=8000 \
    JWT_SECRET=your-secret-key-here \
    ALGORITHM=HS256 \
    ACCESS_TOKEN_EXPIRE_MINUTES=30

# Expose the application port
EXPOSE ${PORT}

# Run the application (updated CMD format)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --reload"]

