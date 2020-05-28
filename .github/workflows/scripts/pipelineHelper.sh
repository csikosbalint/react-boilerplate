set -x
# BITBUCKET_CLONE_DIR | GITHUB_WORKSPACE
export CLONE_DIR="${GITHUB_WORKSPACE}"
# BITBUCKET_BRANCH:feature/first | GITHUB_REF:refs/heads/feature/first
export BRANCH="$(echo $GITHUB_REF | awk 'BEGIN{FS="/"} {print $(NF-1)"/"$NF}')"
function pipelineVersioning {
    FUNC=$1
    ARGS="\"$(echo $@ | cut -d' ' -f2- | sed -e 's/ /", "/g')\""
    node -e "require('./.github/workflows/scripts/pipelineVersioning').$FUNC($ARGS)";
}

function calculateVersion {
    case "$1" in
        master)
            AVER="$(git show HEAD:package.json | grep -e '"version":' | cut -d: -f2 | sed -e 's/"//g' -e 's/,//' | xargs)"
            PVER="$(git show HEAD^:package.json | grep -e '"version":' | cut -d: -f2 | sed -e 's/"//g' -e 's/,//' | xargs)"
            NVER="$(pipelineVersioning getNextVersion $AVER $PVER)"
            if ! ( echo "$NVER" | grep -Eo '[0-9]{1,}.[0-9]{1,}.[0-9]{1,}' );then
                echo "FIX VERSION!"
                echo "MSG:$NVER:END"
                return -1
            else
                return 0
            fi
        ;;
        feature)
            AVER="$(git show HEAD:package.json | grep -e '"version":' | cut -d: -f2 | sed -e 's/"//g' -e 's/,//' | xargs)"
            NVER="$(echo $AVER | cut -d. -f1).F${BRANCH:8}.0"
            return 0
        ;;
        hotfix)
            AVER="$(git show HEAD:package.json | grep -e '"version":' | cut -d: -f2 | sed -e 's/"//g' -e 's/,//' | xargs)"
            NVER="$(echo $AVER | cut -d. -f1).$(echo $AVER | cut -d. -f2).H${BRANCH:7}"
            return 0
        ;;
        bugfix)
            AVER="$(git show HEAD:package.json | grep -e '"version":' | cut -d: -f2 | sed -e 's/"//g' -e 's/,//' | xargs)"
            NVER="$(echo $AVER | cut -d. -f1).$(echo $AVER | cut -d. -f2).B${BRANCH:7}"
            return 0
        ;;
        *)
            echo "MISSING/WRONG/UNSUPPORTED PARAM: $@" && return -1
        ;;
    esac
}

function applyVersionChange {
    case "$1" in
        master)
            if [ "$NVER" != "$AVER" ]; then
                pipelineVersioning changeVersionToPackageJSON $NVER || return -1
                echo "::set-output name=applyVersionChange::true" || return -1
            fi
        ;;
        feature|hotfix|bugfix)
            pipelineVersioning changeVersionToPackageJSON $NVER || return -1
            echo "::set-output name=applyVersionChange::true" || return -1
        ;;
        *)
            echo "MISSING/WRONG/UNSUPPORTED PARAM: $@" && return -1
        ;;
    esac
    echo -e "AVER=$AVER\nNVER=$NVER\nMODIFIED=package.json\n" > pass_env.sh
}

function commitVersionChange {
    set -x
    test -f pass_env.sh && source pass_env.sh
    case "$1" in
        master)
            if [ "$NVER" != "$AVER" ]; then
                git checkout master
                git add $MODIFIED
                git commit --amend --no-edit
                git push --force || return -1
            fi
        ;;
        feature)
            git add $MODIFIED
            git commit -m "[skip ci]Feature specific verion number (minor bump)."
            git push || return -1
        ;;
        hotfix)
            git add $MODIFIED
            git commit -m "[skip ci]Hotfix specific verion number (patch bump)."
            git push || return -1
        ;;
        bugfix)
            git add $MODIFIED
            git commit -m "[skip ci]Bugfix specific verion number (patch bump)."
            git push || return -1
        ;;
        *)
            echo "MISSING/WRONG/UNSUPPORTED PARAM: $@" && return -1
        ;;
    esac
}
