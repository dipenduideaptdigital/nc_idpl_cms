import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import * as repo from "./contactForms.repository.js";

export const createNewContactFormInstance = async (payload) => {
  const baseSlug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.name);
  const isSlugClaimed = await repo.findFormBySlug(baseSlug);
  
  if (isSlugClaimed) {
    throw new AppError(`Form validation mismatch error: Targeted resource unique slug entry path sequence identifier '${baseSlug}' is already active inside system structures. Try changing signature text blocks.`, StatusCodes.CONFLICT);
  }

  const cleanFormPayload = {
    ...payload,
    slug: baseSlug,
    notifyEmails: payload.notifyEmails || []
  };

  return await repo.persistFormNodeRecord(cleanFormPayload);
};

export const updateContactFormInstance = async (id, payload) => {
  const targetForm = await repo.findFormById(id);
  if (!targetForm) throw new AppError("Target contact form configurations map instance invalid node pointer mapping tracking failed", StatusCodes.NOT_FOUND);

  const dataPayloadUpdate = { ...payload };
  if (payload.slug) {
    const freshSlugNormalized = generateSlug(payload.slug);
    if (freshSlugNormalized !== targetForm.slug) {
      const isClaimed = await repo.findFormBySlug(freshSlugNormalized);
      if (isClaimed) throw new AppError("Requested slug metadata tracking address token allocation claimed already by secondary instance loop check operational tracking parameters", StatusCodes.CONFLICT);
      dataPayloadUpdate.slug = freshSlugNormalized;
    }
  }

  return await repo.updateFormNodeRecord(id, dataPayloadUpdate);
};

export const getContactFormsCollection = async () => {
  return await repo.fetchAllFormsCollection();
};

export const getContactFormGranularProfile = async (id) => {
  const form = await repo.findFormById(id);
  if (!form) throw new AppError("Contact form parameters map structure lookup context missing exception mismatch logic logs checking tracking node arrays", StatusCodes.NOT_FOUND);
  return form;
};

export const executeFormDeactivationOrRemoval = async (id) => {
  const form = await repo.findFormById(id);
  if (!form) throw new AppError("Form configuration profile reference metadata token invalid validation boundary match execution cycle check mapping loops failed", StatusCodes.NOT_FOUND);

  return await repo.hardDeleteFormEntityIfUnused(id);
};