import { useState } from 'react';
import PropTypes from 'prop-types';
import bookmarksData from '../../data/bookmarks.json';

const Bookmarks = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const handleBookmarkClick = (url) => {
        onNavigate(url);
        setIsOpen(false);
        setActiveCategory(null);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-tool-bar-item hover:bg-zinc-300 px-3 py-1.5 rounded-md transition duration-300 text-sm font-medium"
            >
                ⭐ Zakładki
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-zinc-200 min-w-[200px] z-50">
                    {bookmarksData.categories.map((category, idx) => (
                        <div key={idx} className="relative">
                            <button
                                onClick={() => setActiveCategory(activeCategory === idx ? null : idx)}
                                className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm font-medium text-zinc-800 flex items-center justify-between"
                            >
                                {category.name}
                                <span className="text-xs">{activeCategory === idx ? '▼' : '▶'}</span>
                            </button>

                            {activeCategory === idx && (
                                <div className="bg-zinc-50 border-t border-zinc-200">
                                    {category.bookmarks.map((bookmark, bIdx) => (
                                        <button
                                            key={bIdx}
                                            onClick={() => handleBookmarkClick(bookmark.url)}
                                            className="w-full text-left px-6 py-2 hover:bg-zinc-100 text-sm group"
                                        >
                                            <div className="font-medium text-zinc-800 group-hover:text-blue-600">
                                                {bookmark.title}
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-0.5">
                                                {bookmark.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Bookmarks.propTypes = {
    onNavigate: PropTypes.func.isRequired
};

export default Bookmarks;
