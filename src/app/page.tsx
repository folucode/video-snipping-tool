'use client';

import { Cloudinary, CloudinaryVideo } from '@cloudinary/url-gen';
import styles from './page.module.css';
import { useState } from 'react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { trim } from '@cloudinary/url-gen/actions/videoEdit';
import { AdvancedVideo } from '@cloudinary/react';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const cloudinary: Cloudinary = new Cloudinary({
  cloud: {
    cloudName,
  },
});

const videoId: string = 'dog-video_tzvryx';

export default function Home() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [transformedVideo, setTransformedVideo] = useState(
    new CloudinaryVideo(videoId, { cloudName })
  );

  const getTransformedVideo = (): void => {
    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    const adjustedStartTime = Math.max(0, startTime - 1);
    const adjustedEndTime = endTime + 1;

    const videoTransformation = cloudinary
      .video(videoId)
      .resize(fill().aspectRatio(aspectRatio).gravity('center'))
      .videoEdit(
        trim().startOffset(adjustedStartTime).endOffset(adjustedEndTime)
      );

    setTransformedVideo(videoTransformation);
  };

  return (
    <div className={styles.main}>
      <h1>Video Snipping Tool</h1>
      <div className={styles.grid}>
        <div>
          <label>
            Platform:
            <label htmlFor='format'>Formats:</label>
            <select
              className={styles.input}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              <option value='9:16'>Instagram Reels</option>
              <option value='1:1'>Instagram Feed</option>
              <option value='16:9'>YouTube Standard</option>
            </select>
          </label>

          <label>
            Start Time (seconds):
            <input
              className={styles.input}
              type='number'
              value={startTime}
              onChange={(e) => setStartTime(Number(e.target.value))}
            />
          </label>

          <label>
            End Time (seconds):
            <input
              className={styles.input}
              type='number'
              value={endTime}
              onChange={(e) => setEndTime(Number(e.target.value))}
            />
          </label>
          <button className={styles.button} onClick={getTransformedVideo}>
            Transform
          </button>
        </div>

        <div className={styles.videoContainer}>
          <h3>Preview:</h3>

          {transformedVideo && (
            <AdvancedVideo cldVid={transformedVideo} controls />
          )}
        </div>
      </div>
    </div>
  );
}
