import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { experienceImageUrl, formatPrice } from '../../lib/format';
import { intensityLabel } from '../../lib/intensity';
import { ambianceForExperience, themeForExperience } from '../../lib/themes';
import { useSiteTheme } from '../../context/SiteThemeContext';
import Badge from '../ui/Badge';

function ExperienceCard({ experience }) {
  const { id, name, description, image, category, duration, intensity_level: intensityLevel, price } = experience;
  const ambiance = ambianceForExperience(experience);
  const theme = themeForExperience(experience);
  const setSiteTheme = useSiteTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isHovered || isFocused;

  useEffect(() => {
    if (!theme || !isActive) return undefined;

    setSiteTheme(theme);
    // Also release the preview when filtering or navigation removes the card.
    return () => setSiteTheme((current) => current === theme ? null : current);
  }, [theme, isActive, setSiteTheme]);

  return (
    <article
      data-theme={theme}
      className="experience-card"
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
      onPointerCancel={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false); }}
    >
      <Link to={`/experiences/${id}`} className="experience-card__link" aria-label={`Découvrir l’expérience ${name}`}>
        {image && <img className="experience-card__image" src={experienceImageUrl(image)} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />}
        <div className="experience-card__shade" aria-hidden="true" />
        <div className="experience-card__top"><Badge>{category}</Badge><span className="experience-code">{ambiance.code}</span></div>
        <div className="experience-card__body">
          <p className="experience-card__tagline">{ambiance.tagline}</p>
          <h3>{name}</h3>
          <p className="experience-card__description">{description}</p>
          <div className="experience-card__facts"><span>{duration} min</span><span className="intensity-meter" aria-label={`Intensité : ${intensityLabel(intensityLevel)}`}><span aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < Number(intensityLevel) ? 'is-lit' : ''} />)}</span>{intensityLabel(intensityLevel)}</span></div>
          <div className="experience-card__footer"><span><strong>{formatPrice(price)}</strong><small> / personne</small></span><span className="experience-card__explore">Explorer <span aria-hidden="true">↗</span></span></div>
        </div>
      </Link>
    </article>
  );
}
export default ExperienceCard;
