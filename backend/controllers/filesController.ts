import { Response } from 'express';
import { UploadedFile } from '../lib/store.js';
import { logError } from '../utils/logger.js';
import { supabase } from '../supabase/supabaseClient.js';
import { UUID } from 'crypto';

const ALLOWED_FILE_TYPES = ['txt'] as const;
export type AllowedFileTypes = (typeof ALLOWED_FILE_TYPES)[number];

const isAllowedFileType = (type: string): type is AllowedFileTypes => {
  return ALLOWED_FILE_TYPES.includes(type as AllowedFileTypes);
};

export const addFile = async (
  file: UploadedFile,
  mimetype: string
): Promise<void> => {
  try {
    const { error } = await supabase.from('files').insert({
      filename: file.filename,
      mimetype,
      content: file.text,
      embedding: file.embedding,
    });

    if (error) {
      logError('Failed to insert file into Supabase', error);
      throw error;
    }
  } catch (err) {
    logError('Error adding file to Supabase', err);
    throw err;
  }
};

export const deleteFile = async (id: UUID): Promise<void> => {
  try {
    const { error } = await supabase.from('files').delete().eq('id', id);

    if (error) {
      logError('Failed to delete file from Supabase', error);
      throw error;
    }
  } catch (err) {
    logError('Error deleting file from Supabase', err);
    throw err;
  }
};

export const getFiles = async (): Promise<UploadedFile[]> => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      logError('Failed to fetch files from Supabase', error);
      throw error;
    }

    // Map Supabase records to UploadedFile format
    return (data || []).map((record) => ({
      id: record.id,
      filename: record.filename,
      text: record.content || '',
      timestamp: new Date(record.uploaded_at).getTime(),
      embedding:
        typeof record.embedding === 'string'
          ? JSON.parse(record.embedding)
          : record.embedding,
    }));
  } catch (err) {
    logError('Error fetching files from Supabase', err);
    throw err;
  }
};

const isEmptyFile = (file: Express.Multer.File): boolean => {
  return file.size === 0;
};

export const validateFile = (
  res: Response,
  file: Express.Multer.File | undefined
): file is Express.Multer.File => {
  if (!file) {
    res.status(400).send('No file uploaded');
    return false;
  }

  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (!fileExtension) {
    res.status(400).send('A file was not specified for upload');
    return false;
  }

  if (!isAllowedFileType(fileExtension)) {
    res.status(400).send(`Invalid file type fileExtension: '${fileExtension}'`);
    return false;
  }

  if (isEmptyFile(file)) {
    res.status(400).send('Uploaded file is empty');
    return false;
  }

  return true;
};
