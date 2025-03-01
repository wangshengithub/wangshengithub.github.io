import { loc } from './../locale.js';
import { sideMenu, subSideMenu, infoBoxBuilder } from './functions.js';
import { govBoost } from './government.js';
import { gmen, gov_traits, gov_tasks } from './../governor.js';
import { hoovedRename } from './../functions.js';
import { hoovedReskin } from './../races.js';

export function governPage(content){
    let mainContent = sideMenu('create',content);

    {
        let govern = infoBoxBuilder(mainContent,{ name: 'intro', template: 'governor', label: loc('governor'), paragraphs: 4, h_level: 2,
            para_data: {
                1: [loc('arpa_genepool_governance_title')],
                2: [Object.keys(gmen).length]
            },
            data_link: {
                1: ['wiki.html#crispr-prestige-governance']
            }
        });
        sideMenu('add',`governor-gameplay`,`intro`,loc('governor'));

        Object.keys(gmen).forEach(function (gov){
            infoBoxBuilder(govern,{ name: gov, template: 'government', label: loc(`governor_${gov}`), paragraphs: 2, break: [2], h_level: 3,
                text: {
                    1: `governor_${gov}_desc`
                },
                rawtext: {
                    2: `{{ b | desc }}`
                },
                vue: {
                    data: { b: govBoost(gov === 'bureaucrat' ? 2 : 3) },
                    filters: {
                        desc(b){
                            let desc = '';
                            Object.keys(gmen[gov].traits).forEach(function (t){
                                desc += (gov_traits[t].hasOwnProperty('effect') ? gov_traits[t].effect(b,{isWiki: true}) : '') + ' ';
                            });
                            return desc;;
                        }
                    }
                },
                h_extra: `<div><b-checkbox v-model="b">${loc(gov === 'bureaucrat' ? `arpa_genepool_civil_service_title` : `arpa_genepool_bureaucratic_efficiency_title`)}</b-checkbox></div>`,
            });
            subSideMenu('add',`governor-gameplay`,gov,loc(`governor_${gov}`));
        });
    }

    sideMenu('gap');

    {
        let govern = infoBoxBuilder(mainContent,{ name: 'task', template: 'governor', paragraphs: 3, h_level: 2,
            para_data: {
                2: [3,loc('governor_bureaucrat'),4],
                3: [Object.keys(gov_tasks).length]
            }
        });
        sideMenu('add',`governor-gameplay`,`task`,loc('wiki_governor_task'));

        {
            let task = 'tax';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 3, break: [3], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_unlock`
                },
                para_data: {
                    3: [loc(`tech_tax_rates`)],
                },
                data_link: {
                    3: ['wiki.html#civilized-tech-tax_rates']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'storage';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 3, break: [3], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_unlock`
                },
                para_data: {
                    3: [loc(`tech_containerization`)],
                },
                data_link: {
                    3: ['wiki.html#civilized-tech-containerization']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'bal_storage';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 4, break: [4], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_${task}3`,
                    4: `wiki_governor_task_unlock`
                },
                para_data: {
                    4: [loc(`tech_containerization`)],
                },
                data_link: {
                    4: ['wiki.html#civilized-tech-containerization']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'combo_storage';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 3, break: [2,3], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_unlock`,
                    3: `wiki_governor_task_upgrade`
                },
                para_data: {
                    2: [loc(`tech_containerization`)],
                    3: [loc(`arpa_genepool_bureaucratic_efficiency_title`)]
                },
                data_link: {
                    2: ['wiki.html#civilized-tech-containerization'],
                    3: ['wiki.html#crispr-prestige-bureaucratic_efficiency']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'merc';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 4, break: [4], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_${task}3`,
                    4: `wiki_governor_task_unlock`
                },
                para_data: {
                    4: [loc(`tech_mercs`)],
                },
                data_link: {
                    4: ['wiki.html#civilized-tech-mercs']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'spy';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 3, break: [2,3], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_unlock`,
                    3: `wiki_governor_task_disabled`
                },
                para_data: {
                    2: [loc(`tech_spy`)],
                    3: [loc(`tech_unification`)],
                },
                data_link: {
                    2: ['wiki.html#civilized-tech-spy'],
                    3: ['wiki.html#early_space-tech-unification2']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'spyop';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 8, break: [2,3,4,5,6,7,8], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_${task}3`,
                    4: `wiki_governor_task_${task}3`,
                    5: `wiki_governor_task_${task}4`,
                    6: `wiki_governor_task_${task}5`,
                    7: `wiki_governor_task_unlock`,
                    8: `wiki_governor_task_disabled`
                },
                para_data: {
                    2: [1,loc(`civics_spy_sabotage`)],
                    3: [2,loc(`civics_spy_influence`)],
                    4: [3,loc(`civics_spy_incite`)],
                    6: [loc(`civics_spy_sabotage`),loc(`civics_spy_incite`),loc(`civics_spy_influence`)],
                    7: [loc(`tech_espionage`)],
                    8: [loc(`tech_unification`)],
                },
                data_link: {
                    7: ['wiki.html#civilized-tech-spy'],
                    8: ['wiki.html#early_space-tech-unification2']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'combo_spy';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 3, break: [2,3], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_unlock`,
                    3: `wiki_governor_task_upgrade`
                },
                para_data: {
                    2: [loc(`tech_espionage`)],
                    3: [loc(`arpa_genepool_bureaucratic_efficiency_title`)]
                },
                data_link: {
                    2: ['wiki.html#civilized-tech-spy'],
                    3: ['wiki.html#crispr-prestige-bureaucratic_efficiency']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'slave';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`,[loc(`resource_Slave_name`)]), paragraphs: 2, break: [2], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_trait`
                },
                para_data: {
                    2: [loc(`trait_slaver_name`)],
                },
                data_link: {
                    2: ['wiki.html#traits-species-major_slaver']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`,[loc(`resource_Slave_name`)]));
        }

        {
            let task = 'sacrifice';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 2, break: [2], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_trait`
                },
                para_data: {
                    2: [loc(`trait_cannibalize_name`)],
                },
                data_link: {
                    2: ['wiki.html#traits-species-major_cannibalize']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'horseshoe';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 2, break: [2], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_trait`
                },
                para_data: {
                    1: [loc(`city_${hoovedRename(true)}`,[hoovedRename(false)]),hoovedRename(false)],
                    2: [hoovedReskin(false)],
                },
                data_link: {
                    2: ['wiki.html#traits-species-major_hooved']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`city_${hoovedRename(true)}`,[hoovedRename(false)]));
        }

        {
            let task = 'trash';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 7, break: [3,5,7], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_${task}3`,
                    4: `wiki_governor_task_${task}3min`,
                    5: `wiki_governor_task_${task}3a`,
                    6: `wiki_governor_task_${task}3max`,
                    7: `wiki_governor_task_${task}4`
                },
                para_data: {
                    7: [loc(`interstellar_mass_ejector`)],
                },
                data_link: {
                    7: ['wiki.html#interstellar-structures-mass_ejector']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }

        {
            let task = 'mech';
            infoBoxBuilder(govern,{ name: task, template: 'government', label: loc(`gov_task_${task}`), paragraphs: 4, break: [4], h_level: 3,
                text: {
                    1: `wiki_governor_task_${task}1`,
                    2: `wiki_governor_task_${task}2`,
                    3: `wiki_governor_task_${task}3`,
                    4: `wiki_governor_task_${task}4`
                },
                para_data: {
                    4: [1,loc(`wiki_resets_infusion`),loc(`portal_spire_name`)],
                },
                data_link: {
                    4: [false,'wiki.html#resets-prestige-infusion','wiki.html#hell-structures-spire']
                }
            });
            subSideMenu('add',`governor-gameplay`,task,loc(`gov_task_${task}`));
        }
    }
}
