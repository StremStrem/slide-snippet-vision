FROM node:18-slim

WORKDIR /app

# Install Python, pip, ffmpeg, and clean apt cache in one step
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package files separately for better caching
COPY package*.json ./
COPY backend/requirements.txt backend/requirements.txt

# Install dependencies
RUN npm install
RUN pip3 install --no-cache-dir --break-system-packages -r backend/requirements.txt

# Copy rest of the app
COPY . .

# Expose port 3000 as your backend listens there
EXPOSE 3000

# Start your backend
CMD ["node", "--loader", "ts-node/esm", "backend/app.ts"]
