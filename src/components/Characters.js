import React, { useState, useTransition } from "react";
import { GET_CHARACTERS } from "../graphqlQuery";
import { useTranslation, usteTranslation } from "react-i18next";
import { gql, useQuery } from '@apollo/client';
import i18n from '../i18n';
import InfiniteScroll from 'react-infinite-scroll-component';


function Characters() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [species, setSpecies] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [characters, setCharacters] = useState([]);


    const { loading, error, data, fetchMore, refetch } = useQuery(GET_CHARACTERS, {
        variables: { page, status: status || null, species: species || null },
        onCompleted: (data) => {
            if (page === 1) {
                setCharacters(data.characters.results);
            }
        }
    });

    const loadMore = () => {
        const nextPage = page + 1;
        fetchMore({
            variables: { page: nextPage, status, species },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prevResult;

                setCharacters(prev => [
                    ...prev,
                    ...fetchMoreResult.characters.results
                ]);

                setPage(nextPage);
            }
        });
    };


    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchMore({
            variables: { page: newPage, status, species },
        });
    };

    //const totalPages = data?.characters?.info?.pages || 1;

    const handleFilterChange = () => {
        setPage(1);
        setCharacters([]);
        refetch({ page: 1, status, species });
    };


    const handleSortChange = (criteria) => {
        setSortBy(criteria)
    }

    const sortedCharacters = [...characters].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'origin') return a.origin.name.localeCompare(b.origin.name);
        return 0;
    });



    //if (loading) return <p>{t('Loading')}...</p>;
    if (error) return <p>{t('Error loading characters')}</p>;

    return (
        <div className="container-fluid">
            <h2 className="text-center my-4 mb-5">{t('Rick and Morty')}</h2>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="bg-light p-3 rounded shadow-sm">
                        <h5>{t('Filter')}</h5>
                        <div className="mb-3">
                            <label className="form-label">{t('species')}</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('Enter Species')}
                                value={species}
                                onChange={e => { setSpecies(e.target.value); handleFilterChange(); }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">{t('Status')}</label>
                            <select
                                className="form-select"
                                value={status}
                                onChange={e => { setStatus(e.target.value); handleFilterChange(); }}
                            >
                                <option value="">{t('All')}</option>
                                <option value="Alive">{t('Alive')}</option>
                                <option value="Dead">{t('Dead')}</option>
                                <option value="unknown">{t('Unknown')}</option>
                            </select>
                        </div>

                        <h5>{t('Sort')}</h5>
                        <div className="d-grid gap-2 mb-4">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleSortChange('name')}
                            >
                                {t('Sort by name')}
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleSortChange('origin')}
                            >
                                {t('Sort by origin')}
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setSortBy(null);
                                    refetch();
                                }}
                            >
                                {t('Clear')}
                            </button>
                        </div>

                        <h5 className="mb-3">{t('Language')}</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-light border" onClick={() => i18n.changeLanguage('en')}>English</button>
                            <button className="btn btn-sm btn-light border" onClick={() => i18n.changeLanguage('de')}>Deutsch</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-9 text-center">
                    {loading && page === 1 ? (
                        <p>{t('Loading')}...</p>
                    ) : (
                        <InfiniteScroll
                            dataLength={sortedCharacters.length}
                            next={loadMore}
                            hasMore={data?.characters?.info?.next != null}
                            loader={<h4>{t('Loading')}...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>{t('You have seen it all')}</b>
                                </p>
                            }
                        >
                            <div className="row">
                                {sortedCharacters.map(character => (
                                    <div key={character.id} className="col-md-4 mb-4">
                                        <div className="card h-100 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="card-title">{character.name}</h5>
                                                <p className="card-text">{t('status')}: {character.status}</p>
                                                <p className="card-text">{t('species')}: {character.species}</p>
                                                <p className="card-text">{t('gender')}: {character.gender}</p>
                                                <p className="card-text">{t('origin')}: {character.origin.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>




            </div>
        </div>

    );
}

export default Characters;